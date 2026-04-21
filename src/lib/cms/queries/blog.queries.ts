import { createSupabaseServerClient } from '../../supabase/server';
import { createSupabasePublicClient } from '../../supabase/public-client';
import type { CmsBlogPost } from '../types';
import { getAdminReadCached } from '../admin-read-cache';

// ─── Public queries (ISR-safe) ────────────────────────────────────────────────

/** Returns all published blog posts, ordered by sort_order then published_at. */
export async function getPublishedBlogPosts(): Promise<CmsBlogPost[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false });

  if (error || !data) return [];
  return data as CmsBlogPost[];
}

/** Returns a single published blog post by slug, or null if not found. */
export async function getPublishedBlogPostBySlug(slug: string): Promise<CmsBlogPost | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data as CmsBlogPost;
}

/** Returns the featured published blog post (first one with is_featured = true). */
export async function getFeaturedBlogPost(): Promise<CmsBlogPost | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as CmsBlogPost;
}

/** Returns related published posts (all published except the current slug, up to limit). */
export async function getRelatedBlogPosts(
  currentSlug: string,
  limit = 3
): Promise<CmsBlogPost[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as CmsBlogPost[];
}

// ─── Admin queries (server client, auth required) ────────────────────────────

/** Returns all blog posts for admin list view (all statuses, ordered by sort_order). */
export async function getAllBlogPostsForAdmin(): Promise<CmsBlogPost[]> {
  return getAdminReadCached('blogs', ['list'], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as CmsBlogPost[];
  });
}

/** Returns a single blog post by ID for admin editor. */
export async function getBlogPostByIdForAdmin(id: string): Promise<CmsBlogPost | null> {
  return getAdminReadCached('blogs', ['id', id], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as CmsBlogPost;
  });
}

/** Returns a single blog post by slug for admin editor (used for slug-based routing). */
export async function getBlogPostBySlugForAdmin(slug: string): Promise<CmsBlogPost | null> {
  return getAdminReadCached('blogs', ['slug', slug], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return data as CmsBlogPost;
  });
}
