import { createSupabaseServerClient } from '../../supabase/server';
import { createSupabasePublicClient } from '../../supabase/public-client';
import type { CmsJobPosition, CmsPageSection } from '../types';
import type { CareersHeroPayload } from '../types/payloads';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import { getAdminReadCached } from '../admin-read-cache';

// ─── Public queries (ISR-safe) ────────────────────────────────────────────────

/** Returns all published job positions, ordered by sort_order then created_at. */
export async function getPublishedJobPositions(): Promise<CmsJobPosition[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('job_positions')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as CmsJobPosition[];
}

/** Returns a single published job position by slug, or null if not found. */
export async function getPublishedJobPositionBySlug(
  slug: string
): Promise<CmsJobPosition | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('job_positions')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data as CmsJobPosition;
}

/** Returns the careers hero page section for the public site. */
export async function getCareersHeroSection(): Promise<
  CmsPageSection<CareersHeroPayload> | null
> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('schema_key', SCHEMA_KEYS.CAREERS_HERO)
    .single();

  if (error || !data) return null;
  return data as CmsPageSection<CareersHeroPayload>;
}

/** Returns the careers page row (slug='careers') for admin use. */
export async function getCareersPageForAdmin(): Promise<{ id: string; slug: string } | null> {
  return getAdminReadCached('careers', ['page'], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('pages')
      .select('id, slug')
      .eq('slug', 'careers')
      .single();

    if (error || !data) return null;
    return data as { id: string; slug: string };
  });
}

// ─── Admin queries (server client, auth required) ────────────────────────────

/** Returns all job positions for admin list view (all statuses, ordered by sort_order). */
export async function getAllJobPositionsForAdmin(): Promise<CmsJobPosition[]> {
  return getAdminReadCached('careers', ['positions'], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('job_positions')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as CmsJobPosition[];
  });
}

/** Returns a single job position by ID for admin editor. */
export async function getJobPositionByIdForAdmin(
  id: string
): Promise<CmsJobPosition | null> {
  return getAdminReadCached('careers', ['position', id], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('job_positions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as CmsJobPosition;
  });
}

/** Returns careers hero page section for admin editor. */
export async function getCareersHeroSectionForAdmin(): Promise<
  CmsPageSection<CareersHeroPayload> | null
> {
  return getAdminReadCached('careers', ['hero-section'], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('schema_key', SCHEMA_KEYS.CAREERS_HERO)
      .single();

    if (error || !data) return null;
    return data as CmsPageSection<CareersHeroPayload>;
  });
}
