'use server';

import { requireCmsActionCapability } from '@/lib/admin/require-admin-user';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { writeCmsAuditLog } from './audit';
import { invalidateAdminReadScope } from './admin-read-cache';
import { blogPostFormSchema } from './schemas';
import type { BlogPostFormPayload } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Create
// ─────────────────────────────────────────────────────────────────────────────

export async function createBlogPostWithSlug(
  slug: string,
  payload: BlogPostFormPayload,
  sortOrder = 0
): Promise<{ id: string; slug: string }> {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  const validated = blogPostFormSchema.parse(payload);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug,
      title: validated.title,
      badge: validated.badge ?? null,
      excerpt: validated.excerpt ?? null,
      cover_image_bg: validated.cover_image_bg ?? null,
      cover_image_url: validated.cover_image_url ?? null,
      cover_image_alt: validated.cover_image_alt ?? null,
      cover_aspect_ratio: validated.cover_aspect_ratio ?? null,
      content: validated.content,
      mid_content: validated.mid_content,
      seo_title: validated.seo_title ?? null,
      seo_description: validated.seo_description ?? null,
      og_image: validated.og_image ?? null,
      keywords: validated.keywords,
      is_featured: validated.is_featured,
      sort_order: sortOrder,
      status: 'draft',
      has_unpublished_changes: true,
      last_edited_by: actor.userId,
      last_edited_by_identifier: actor.email,
      last_edited_at: now,
    })
    .select('id, slug')
    .single();

  if (error || !data) {
    console.error('Error creating blog post:', error);
    throw new Error('Failed to create blog post.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'blog_post',
    entityId: data.id,
    entityKeyOrId: slug,
    pageSlugOrSchemaKey: slug,
    summary: `Created blog post draft "${validated.title}" (${slug})`,
  });

  invalidateAdminReadScope('blogs');

  return { id: data.id, slug: data.slug };
}

// ─────────────────────────────────────────────────────────────────────────────
// Save draft
// ─────────────────────────────────────────────────────────────────────────────

export async function saveBlogPostDraft(
  postId: string,
  payload: BlogPostFormPayload
): Promise<void> {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  const validated = blogPostFormSchema.parse(payload);
  const now = new Date().toISOString();

  const { data: existing, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, slug')
    .eq('id', postId)
    .single();

  if (fetchError || !existing) {
    throw new Error('Blog post not found.');
  }

  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: validated.title,
      badge: validated.badge ?? null,
      excerpt: validated.excerpt ?? null,
      cover_image_bg: validated.cover_image_bg ?? null,
      cover_image_url: validated.cover_image_url ?? null,
      cover_image_alt: validated.cover_image_alt ?? null,
      cover_aspect_ratio: validated.cover_aspect_ratio ?? null,
      content: validated.content,
      mid_content: validated.mid_content,
      seo_title: validated.seo_title ?? null,
      seo_description: validated.seo_description ?? null,
      og_image: validated.og_image ?? null,
      keywords: validated.keywords,
      is_featured: validated.is_featured,
      has_unpublished_changes: true,
      last_edited_by: actor.userId,
      last_edited_by_identifier: actor.email,
      last_edited_at: now,
    })
    .eq('id', postId);

  if (error) {
    console.error('Error saving blog post draft:', error);
    throw new Error('Failed to save blog post draft.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'blog_post',
    entityId: postId,
    entityKeyOrId: existing.slug,
    pageSlugOrSchemaKey: existing.slug,
    summary: `Saved blog post draft "${validated.title}" (${existing.slug})`,
  });

  invalidateAdminReadScope('blogs');
}

// ─────────────────────────────────────────────────────────────────────────────
// Publish
// ─────────────────────────────────────────────────────────────────────────────

export async function publishBlogPost(postId: string): Promise<void> {
  const actor = await requireCmsActionCapability('publish');
  const supabase = await createSupabaseServerClient();
  const publishedAt = new Date().toISOString();

  const { data: post, error: fetchError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    throw new Error('Blog post not found.');
  }

  // Validate draft content before publishing
  const validated = blogPostFormSchema.parse({
    title: post.title,
    badge: post.badge,
    excerpt: post.excerpt,
    cover_image_bg: post.cover_image_bg,
    cover_image_url: post.cover_image_url,
    cover_image_alt: post.cover_image_alt,
    cover_aspect_ratio: post.cover_aspect_ratio,
    content: post.content,
    mid_content: post.mid_content,
    seo_title: post.seo_title,
    seo_description: post.seo_description,
    og_image: post.og_image,
    keywords: post.keywords ?? [],
    is_featured: post.is_featured,
  });

  const { error } = await supabase
    .from('blog_posts')
    .update({
      status: 'published',
      published_at: post.published_at ?? publishedAt,

      // Snapshot all draft content to published columns
      published_title: validated.title,
      published_badge: validated.badge ?? null,
      published_excerpt: validated.excerpt ?? null,
      published_cover_image_bg: validated.cover_image_bg ?? null,
      published_cover_image_url: validated.cover_image_url ?? null,
      published_cover_image_alt: validated.cover_image_alt ?? null,
      published_cover_aspect_ratio: validated.cover_aspect_ratio ?? null,
      published_content: validated.content,
      published_mid_content: validated.mid_content,
      published_seo_title: validated.seo_title ?? null,
      published_seo_description: validated.seo_description ?? null,
      published_og_image: validated.og_image ?? null,
      published_keywords: validated.keywords,
      published_is_featured: validated.is_featured,

      has_unpublished_changes: false,
      last_published_by: actor.userId,
      last_published_by_identifier: actor.email,
      last_published_at: publishedAt,
    })
    .eq('id', postId);

  if (error) {
    console.error('Error publishing blog post:', error);
    throw new Error('Failed to publish blog post.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'publish',
    entityType: 'blog_post',
    entityId: postId,
    entityKeyOrId: post.slug,
    pageSlugOrSchemaKey: post.slug,
    summary: `Published blog post "${post.title}" (${post.slug})`,
  });

  invalidateAdminReadScope('blogs');
}

// ─────────────────────────────────────────────────────────────────────────────
// Update sort order (used by list drag-and-drop)
// ─────────────────────────────────────────────────────────────────────────────

export async function updateBlogPostSortOrder(
  updates: Array<{ id: string; sort_order: number }>
): Promise<void> {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  for (const update of updates) {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        sort_order: update.sort_order,
        last_edited_by: actor.userId,
        last_edited_by_identifier: actor.email,
        last_edited_at: new Date().toISOString(),
      })
      .eq('id', update.id);

    if (error) {
      console.error('Error updating blog post sort order:', error);
      throw new Error('Failed to update sort order.');
    }
  }

  invalidateAdminReadScope('blogs');
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteBlogPost(postId: string): Promise<void> {
  const actor = await requireCmsActionCapability('edit_draft');
  const supabase = await createSupabaseServerClient();

  const { data: post, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, slug, title')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    throw new Error('Blog post not found.');
  }

  const { error } = await supabase.from('blog_posts').delete().eq('id', postId);

  if (error) {
    console.error('Error deleting blog post:', error);
    throw new Error('Failed to delete blog post.');
  }

  await writeCmsAuditLog({
    actorUserId: actor.userId,
    actorEmail: actor.email,
    actorRole: actor.role,
    actionType: 'save_draft',
    entityType: 'blog_post',
    entityId: postId,
    entityKeyOrId: post.slug,
    pageSlugOrSchemaKey: post.slug,
    summary: `Deleted blog post "${post.title}" (${post.slug})`,
  });

  invalidateAdminReadScope('blogs');
}
