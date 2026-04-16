'use server';

import { revalidatePath } from 'next/cache';
import { requireCmsActionCapability } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { writeCmsAuditLog } from './audit';
import type { SupportedSharedSchemaKey } from './constants/shared-sections';
import { SCHEMA_KEYS } from './constants/schema-keys';
import { resolveSharedSectionUsage } from './resolvers/shared-usage.resolver';
import { CMS_REGISTRY, homePageSchema } from './schemas';

type SchemaRegistry = Record<string, { parse: (value: unknown) => unknown }>;

const GLOBAL_CHROME_REVALIDATE_PATHS = [
  '/',
  '/for-brands',
  '/for-creators',
  '/blogs',
  '/blogs/[slug]',
  '/careers',
  '/our-brand',
] as const;

const GLOBAL_METADATA_REVALIDATE_PATHS = ['/', '/for-creators'] as const;

function revalidateGlobalChromeRoutes() {
  for (const route of GLOBAL_CHROME_REVALIDATE_PATHS) {
    revalidatePath(route);
  }
}

function revalidateGlobalMetadataRoutes() {
  for (const route of GLOBAL_METADATA_REVALIDATE_PATHS) {
    revalidatePath(route);
  }
}

export async function saveHomePageSettings(pageId: string, payload: unknown) {
  return savePageSettingsDraft(pageId, payload);
}

export async function savePageSettingsDraft(pageId: string, payload: unknown) {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  const validatedData = homePageSchema.parse(payload);
  const editedAt = new Date().toISOString();

  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('id, slug')
    .eq('id', pageId)
    .single();

  if (pageError || !page) {
    throw new Error('Page not found.');
  }

  const { error } = await supabase
    .from('pages')
    .update({
      internal_name: validatedData.internal_name,
      status: validatedData.status,
      seo_title: validatedData.seo_title,
      seo_description: validatedData.seo_description,
      og_image: validatedData.og_image,
      og_image_alt: validatedData.og_image_alt,
      canonical_url: validatedData.canonical_url,
      keywords: validatedData.keywords,
      has_unpublished_changes: true,
      last_edited_by: actor.userId,
      last_edited_by_identifier: actor.email,
      last_edited_at: editedAt,
    })
    .eq('id', pageId);

  if (error) {
    console.error('Error saving page settings:', error);
    throw new Error('Failed to save page settings.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'page',
    entityId: page.id,
    entityKeyOrId: page.id,
    pageSlugOrSchemaKey: page.slug,
    summary: `Saved draft page settings for ${page.slug}`,
  });
}

export async function savePageSection(
  pageId: string,
  schemaKey: string,
  payload: unknown,
  enabled?: boolean
) {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  const schema = (CMS_REGISTRY as SchemaRegistry)[schemaKey];
  if (!schema) {
    throw new Error(`No validation schema found for ${schemaKey}`);
  }

  const validatedContent = schema.parse(payload);
  const editedAt = new Date().toISOString();

  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('slug')
    .eq('id', pageId)
    .single();

  if (pageError || !page) {
    throw new Error('Page not found.');
  }

  const updateData: Record<string, unknown> = {
    content: validatedContent,
    has_unpublished_changes: true,
    last_edited_by: actor.userId,
    last_edited_by_identifier: actor.email,
    last_edited_at: editedAt,
  };
  if (enabled !== undefined) {
    updateData.enabled = enabled;
  }

  const { data: section, error } = await supabase
    .from('page_sections')
    .update(updateData)
    .eq('page_id', pageId)
    .eq('schema_key', schemaKey)
    .select('id')
    .single();

  if (error || !section) {
    console.error(`Error saving page section ${schemaKey}:`, error);
    throw new Error(`Failed to save section ${schemaKey}.`);
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'page_section',
    entityId: section.id,
    entityKeyOrId: schemaKey,
    pageSlugOrSchemaKey: page.slug,
    summary: `Saved draft section ${schemaKey} for page ${page.slug}`,
  });
}

export async function saveSharedSection(schemaKey: string, payload: unknown, enabled?: boolean) {
  const actor = await requireCmsActionCapability('manage_shared_sections');
  const supabase = await createSupabaseServerClient();

  const schema = (CMS_REGISTRY as SchemaRegistry)[schemaKey];
  if (!schema) {
    throw new Error(`No validation schema found for ${schemaKey}`);
  }

  const validatedContent = schema.parse(payload);
  const editedAt = new Date().toISOString();

  const updateData: Record<string, unknown> = {
    content: validatedContent,
    has_unpublished_changes: true,
    last_edited_by: actor.userId,
    last_edited_by_identifier: actor.email,
    last_edited_at: editedAt,
  };
  if (enabled !== undefined) {
    updateData.enabled = enabled;
  }

  const { data: section, error } = await supabase
    .from('shared_sections')
    .update(updateData)
    .eq('schema_key', schemaKey)
    .select('id')
    .single();

  if (error || !section) {
    console.error(`Error saving shared section ${schemaKey}:`, error);
    throw new Error(`Failed to save shared section ${schemaKey}.`);
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'shared_section',
    entityId: section.id,
    entityKeyOrId: schemaKey,
    pageSlugOrSchemaKey: schemaKey,
    summary: `Saved draft shared section ${schemaKey}`,
  });
}

export async function publishHomePage(pageId: string) {
  const actor = await requireCmsActionCapability('publish');
  const supabase = await createSupabaseServerClient();
  const publishedAt = new Date().toISOString();

  const { data: pageData, error: pageFetchError } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single();

  if (pageFetchError || !pageData) {
    throw new Error('Page not found.');
  }

  const { error: pageError } = await supabase.rpc('publish_page', { p_page_id: pageId });

  if (pageError) {
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

  const { error: pageMetaUpdateError } = await supabase
    .from('pages')
    .update({
      last_published_by: actor.userId,
      last_published_by_identifier: actor.email,
      last_published_at: publishedAt,
    })
    .eq('id', pageId);

  if (pageMetaUpdateError) {
    console.error('Error updating page publish metadata:', pageMetaUpdateError);
  }

  const { data: sections } = await supabase.from('page_sections').select('*').eq('page_id', pageId);
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
        summary: `Published page section ${sec.schema_key} for ${pageData.slug}`,
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

  revalidatePath('/');
}

export async function publishForCreatorsPage(pageId: string) {
  const actor = await requireCmsActionCapability('publish');
  const supabase = await createSupabaseServerClient();
  const publishedAt = new Date().toISOString();

  const { data: pageData, error: pageFetchError } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single();

  if (pageFetchError || !pageData) {
    throw new Error('Page not found.');
  }

  const { error: pageError } = await supabase.rpc('publish_page', { p_page_id: pageId });
  if (pageError) {
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

  const { data: sections } = await supabase.from('page_sections').select('*').eq('page_id', pageId);
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
        summary: `Published page section ${sec.schema_key} for ${pageData.slug}`,
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

  revalidatePath('/for-creators');
}

export async function saveGlobalSettingDraft(schemaKey: string, payload: unknown, enabled?: boolean) {
  const actor = await requireCmsActionCapability('manage_global_settings');
  const supabase = await createSupabaseServerClient();

  const schema = (CMS_REGISTRY as SchemaRegistry)[schemaKey];
  if (!schema) {
    throw new Error(`No validation schema found for ${schemaKey}`);
  }

  const validatedContent = schema.parse(payload);
  const editedAt = new Date().toISOString();

  const updateData: Record<string, unknown> = {
    content: validatedContent,
    has_unpublished_changes: true,
    last_edited_by: actor.userId,
    last_edited_by_identifier: actor.email,
    last_edited_at: editedAt,
  };

  if (enabled !== undefined) {
    updateData.enabled = enabled;
  }

  const { data: setting, error } = await supabase
    .from('global_settings')
    .update(updateData)
    .eq('schema_key', schemaKey)
    .select('id')
    .single();

  if (error || !setting) {
    console.error(`Error saving global setting ${schemaKey}:`, error);
    throw new Error(`Failed to save global setting ${schemaKey}.`);
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'global_setting',
    entityId: setting.id,
    entityKeyOrId: schemaKey,
    pageSlugOrSchemaKey: schemaKey,
    summary: `Saved draft global setting ${schemaKey}`,
  });
}

export async function publishGlobalSetting(schemaKey: string) {
  const actor = await requireCmsActionCapability('manage_global_settings');
  if (!hasCmsCapability(actor.role, 'publish')) {
    throw new Error('You do not have permission to publish.');
  }
  const supabase = await createSupabaseServerClient();
  const publishedAt = new Date().toISOString();

  const supported = [
    SCHEMA_KEYS.GLOBAL_HEADER,
    SCHEMA_KEYS.GLOBAL_FOOTER,
    SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS,
    SCHEMA_KEYS.GLOBAL_SITE_METADATA,
  ] as const;

  if (!supported.includes(schemaKey as (typeof supported)[number])) {
    throw new Error(
      `Publishing is currently only supported for ${SCHEMA_KEYS.GLOBAL_HEADER}, ${SCHEMA_KEYS.GLOBAL_FOOTER}, ${SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS}, and ${SCHEMA_KEYS.GLOBAL_SITE_METADATA}.`
    );
  }

  const { data: setting, error: fetchError } = await supabase
    .from('global_settings')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (fetchError || !setting) {
    throw new Error(`Global setting ${schemaKey} not found.`);
  }

  const schema = (CMS_REGISTRY as SchemaRegistry)[schemaKey];
  if (!schema) {
    throw new Error(`No validation schema found for ${schemaKey}`);
  }

  const validatedContent = schema.parse(setting.content);

  const { error: updateError } = await supabase
    .from('global_settings')
    .update({
      published_content: validatedContent,
      published_enabled: setting.enabled,
      has_unpublished_changes: false,
      last_published_by: actor.userId,
      last_published_by_identifier: actor.email,
      last_published_at: publishedAt,
    })
    .eq('schema_key', schemaKey);

  if (updateError) {
    console.error(`Error publishing global setting ${schemaKey}:`, updateError);
    throw new Error(`Failed to publish global setting ${schemaKey}.`);
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'publish',
    entityType: 'global_setting',
    entityId: setting.id,
    entityKeyOrId: schemaKey,
    pageSlugOrSchemaKey: schemaKey,
    summary: `Published global setting ${schemaKey}`,
  });

  if (schemaKey === SCHEMA_KEYS.GLOBAL_HEADER || schemaKey === SCHEMA_KEYS.GLOBAL_FOOTER) {
    revalidateGlobalChromeRoutes();
  } else {
    revalidateGlobalMetadataRoutes();
  }
}

export async function publishSharedSection(schemaKey: SupportedSharedSchemaKey) {
  const actor = await requireCmsActionCapability('manage_shared_sections');
  if (!hasCmsCapability(actor.role, 'publish')) {
    throw new Error('You do not have permission to publish.');
  }
  const supabase = await createSupabaseServerClient();
  const publishedAt = new Date().toISOString();

  if (
    schemaKey !== SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS &&
    schemaKey !== SCHEMA_KEYS.SHARED_CONTACT_CTA
  ) {
    throw new Error(
      `Publishing is currently only supported for ${SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS} and ${SCHEMA_KEYS.SHARED_CONTACT_CTA}.`
    );
  }

  const { data: section, error: fetchError } = await supabase
    .from('shared_sections')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (fetchError || !section) {
    throw new Error(`Shared section ${schemaKey} not found.`);
  }

  const schema = CMS_REGISTRY[schemaKey];
  if (!schema) {
    throw new Error(`No validation schema found for ${schemaKey}`);
  }

  const validatedContent = schema.parse(section.content);

  const { error: updateError } = await supabase
    .from('shared_sections')
    .update({
      published_content: validatedContent,
      published_enabled: section.enabled,
      has_unpublished_changes: false,
      last_published_by: actor.userId,
      last_published_by_identifier: actor.email,
      last_published_at: publishedAt,
    })
    .eq('schema_key', schemaKey);

  if (updateError) {
    console.error(`Error publishing shared section ${schemaKey}:`, updateError);
    throw new Error(`Failed to publish shared section ${schemaKey}.`);
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'publish',
    entityType: 'shared_section',
    entityId: section.id,
    entityKeyOrId: schemaKey,
    pageSlugOrSchemaKey: schemaKey,
    summary: `Published shared section ${schemaKey}`,
  });

  const affectedRoutes = resolveSharedSectionUsage(schemaKey);
  for (const route of affectedRoutes) {
    revalidatePath(route);
  }
}
