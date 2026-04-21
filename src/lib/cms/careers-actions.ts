'use server';

import { requireCmsActionCapability } from '@/lib/admin/require-admin-user';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { writeCmsAuditLog } from './audit';
import { invalidateAdminReadScope } from './admin-read-cache';
import { careersHeroSchema, jobPositionContentSchema } from './schemas';
import { SCHEMA_KEYS } from './constants/schema-keys';
import type { CareersHeroPayload, JobPositionContent } from './types/payloads';

// ─────────────────────────────────────────────────────────────────────────────
// Careers Hero (page section)
// ─────────────────────────────────────────────────────────────────────────────

export async function saveCareersHeroDraft(
  pageId: string,
  payload: CareersHeroPayload
): Promise<void> {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  const validated = careersHeroSchema.parse(payload);
  const editedAt = new Date().toISOString();

  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('slug')
    .eq('id', pageId)
    .single();

  if (pageError || !page) {
    throw new Error('Careers page not found.');
  }

  const { data: section, error } = await supabase
    .from('page_sections')
    .update({
      content: validated,
      has_unpublished_changes: true,
      last_edited_by: actor.userId,
      last_edited_by_identifier: actor.email,
      last_edited_at: editedAt,
    })
    .eq('page_id', pageId)
    .eq('schema_key', SCHEMA_KEYS.CAREERS_HERO)
    .select('id')
    .single();

  if (error || !section) {
    console.error('Error saving careers hero draft:', error);
    throw new Error('Failed to save careers hero draft.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'page_section',
    entityId: section.id,
    entityKeyOrId: SCHEMA_KEYS.CAREERS_HERO,
    pageSlugOrSchemaKey: page.slug,
    summary: `Saved draft careers hero section for ${page.slug}`,
  });

  invalidateAdminReadScope('careers');
}

/** Publishes the careers page metadata + all its sections (including hero). */
export async function publishCareersPage(pageId: string): Promise<void> {
  const actor = await requireCmsActionCapability('publish');
  const supabase = await createSupabaseServerClient();
  const publishedAt = new Date().toISOString();

  const { data: pageData, error: pageFetchError } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single();

  if (pageFetchError || !pageData) {
    throw new Error('Careers page not found.');
  }

  // Attempt RPC publish, fall back to manual column update
  const { error: rpcError } = await supabase.rpc('publish_page', { p_page_id: pageId });
  if (rpcError) {
    await supabase
      .from('pages')
      .update({
        published_seo_title: pageData.seo_title,
        published_seo_description: pageData.seo_description,
        published_og_image: pageData.og_image,
        published_og_image_alt: pageData.og_image_alt,
        published_keywords: pageData.keywords,
        has_unpublished_changes: false,
      })
      .eq('id', pageId);
  }

  await supabase
    .from('pages')
    .update({
      last_published_by: actor.userId,
      last_published_by_identifier: actor.email,
      last_published_at: publishedAt,
    })
    .eq('id', pageId);

  // Publish all page sections
  const { data: sections } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', pageId);

  if (sections) {
    for (const sec of sections) {
      await supabase
        .from('page_sections')
        .update({
          published_content: sec.content,
          published_enabled: sec.enabled,
          has_unpublished_changes: false,
          last_published_by: actor.userId,
          last_published_by_identifier: actor.email,
          last_published_at: publishedAt,
        })
        .eq('id', sec.id);

      await writeCmsAuditLog({
        actorUserId: actor.userId,
        actorEmail: actor.email,
        actorRole: actor.role,
        actionType: 'publish',
        entityType: 'page_section',
        entityId: sec.id,
        entityKeyOrId: sec.schema_key,
        pageSlugOrSchemaKey: pageData.slug,
        summary: `Published section ${sec.schema_key} for ${pageData.slug}`,
      });
    }
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'publish',
    entityType: 'page',
    entityId: pageData.id,
    entityKeyOrId: pageData.id,
    pageSlugOrSchemaKey: pageData.slug,
    summary: `Published page ${pageData.slug}`,
  });

  invalidateAdminReadScope('careers');
}

// ─────────────────────────────────────────────────────────────────────────────
// Job Positions — Create
// ─────────────────────────────────────────────────────────────────────────────

export async function createJobPosition(
  slug: string,
  payload: JobPositionContent,
  sortOrder = 0
): Promise<{ id: string; slug: string }> {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  const validated = jobPositionContentSchema.parse(payload);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('job_positions')
    .insert({
      slug,
      title: validated.title,
      department: validated.department,
      content: validated,
      status: 'draft',
      sort_order: sortOrder,
      has_unpublished_changes: true,
      last_edited_by: actor.userId,
      last_edited_by_identifier: actor.email,
      last_edited_at: now,
    })
    .select('id, slug')
    .single();

  if (error || !data) {
    console.error('Error creating job position:', error);
    throw new Error('Failed to create job position.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'job_position',
    entityId: data.id,
    entityKeyOrId: slug,
    pageSlugOrSchemaKey: 'careers',
    summary: `Created job position draft "${validated.title}" (${slug})`,
  });

  invalidateAdminReadScope('careers');

  return { id: data.id, slug: data.slug };
}

// ─────────────────────────────────────────────────────────────────────────────
// Job Positions — Save draft
// ─────────────────────────────────────────────────────────────────────────────

export async function saveJobPositionDraft(
  positionId: string,
  payload: JobPositionContent
): Promise<void> {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  const validated = jobPositionContentSchema.parse(payload);
  const now = new Date().toISOString();

  const { data: existing, error: fetchError } = await supabase
    .from('job_positions')
    .select('id, slug')
    .eq('id', positionId)
    .single();

  if (fetchError || !existing) {
    throw new Error('Job position not found.');
  }

  const { error } = await supabase
    .from('job_positions')
    .update({
      title: validated.title,
      department: validated.department,
      content: validated,
      has_unpublished_changes: true,
      last_edited_by: actor.userId,
      last_edited_by_identifier: actor.email,
      last_edited_at: now,
    })
    .eq('id', positionId);

  if (error) {
    console.error('Error saving job position draft:', error);
    throw new Error('Failed to save job position draft.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'job_position',
    entityId: positionId,
    entityKeyOrId: existing.slug,
    pageSlugOrSchemaKey: 'careers',
    summary: `Saved job position draft "${validated.title}" (${existing.slug})`,
  });

  invalidateAdminReadScope('careers');
}

// ─────────────────────────────────────────────────────────────────────────────
// Job Positions — Publish
// ─────────────────────────────────────────────────────────────────────────────

export async function publishJobPosition(positionId: string): Promise<void> {
  const actor = await requireCmsActionCapability('publish');
  const supabase = await createSupabaseServerClient();
  const publishedAt = new Date().toISOString();

  const { data: position, error: fetchError } = await supabase
    .from('job_positions')
    .select('*')
    .eq('id', positionId)
    .single();

  if (fetchError || !position) {
    throw new Error('Job position not found.');
  }

  // Validate draft content before snapshotting to published_content
  const validated = jobPositionContentSchema.parse(position.content);

  const { error } = await supabase
    .from('job_positions')
    .update({
      status: 'published',
      published_at: position.published_at ?? publishedAt,
      published_content: validated,
      has_unpublished_changes: false,
      last_published_by: actor.userId,
      last_published_by_identifier: actor.email,
      last_published_at: publishedAt,
    })
    .eq('id', positionId);

  if (error) {
    console.error('Error publishing job position:', error);
    throw new Error('Failed to publish job position.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'publish',
    entityType: 'job_position',
    entityId: positionId,
    entityKeyOrId: position.slug,
    pageSlugOrSchemaKey: 'careers',
    summary: `Published job position "${position.title}" (${position.slug})`,
  });

  invalidateAdminReadScope('careers');
}

// ─────────────────────────────────────────────────────────────────────────────
// Job Positions — Sort order
// ─────────────────────────────────────────────────────────────────────────────

export async function updateJobPositionSortOrder(
  updates: Array<{ id: string; sort_order: number }>
): Promise<void> {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  for (const update of updates) {
    const { error } = await supabase
      .from('job_positions')
      .update({
        sort_order: update.sort_order,
        last_edited_by: actor.userId,
        last_edited_by_identifier: actor.email,
        last_edited_at: new Date().toISOString(),
      })
      .eq('id', update.id);

    if (error) {
      console.error('Error updating job position sort order:', error);
      throw new Error('Failed to update sort order.');
    }
  }

  invalidateAdminReadScope('careers');
}

// ─────────────────────────────────────────────────────────────────────────────
// Job Positions — Delete
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteJobPosition(positionId: string): Promise<void> {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  const { data: position, error: fetchError } = await supabase
    .from('job_positions')
    .select('id, slug, title')
    .eq('id', positionId)
    .single();

  if (fetchError || !position) {
    throw new Error('Job position not found.');
  }

  const { error } = await supabase
    .from('job_positions')
    .delete()
    .eq('id', positionId);

  if (error) {
    console.error('Error deleting job position:', error);
    throw new Error('Failed to delete job position.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'job_position',
    entityId: positionId,
    entityKeyOrId: position.slug,
    pageSlugOrSchemaKey: 'careers',
    summary: `Deleted job position "${position.title}" (${position.slug})`,
  });

  invalidateAdminReadScope('careers');
}
