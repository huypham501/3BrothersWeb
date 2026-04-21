import { createSupabaseServerClient } from '../../supabase/server';
import { createSupabasePublicClient } from '../../supabase/public-client';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import { getAdminReadCached } from '../admin-read-cache';
import type {
  CmsPage,
  CmsPageSection,
  CmsSharedSection,
  CmsGlobalSetting,
  CmsAuditLog,
} from '../types';

// ─── Public queries (no cookies — ISR-safe) ───────────────────────────────────
// These use the stateless public client so public pages can be statically cached.

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getPageSections(pageId: string): Promise<CmsPageSection[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getSharedSection<T = unknown>(schemaKey: string): Promise<CmsSharedSection<T> | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('shared_sections')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getGlobalSetting<T = unknown>(schemaKey: string): Promise<CmsGlobalSetting<T> | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from('global_settings')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (error || !data) return null;
  return data;
}

// ─── Admin queries (cookie-based server client) ───────────────────────────────
// These read draft content and require auth. Always dynamic — never cached.

export async function getSharedSectionForAdmin<T = unknown>(schemaKey: string): Promise<CmsSharedSection<T> | null> {
  return getAdminReadCached('shared', ['single', schemaKey], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('shared_sections')
      .select('*')
      .eq('schema_key', schemaKey)
      .single();

    if (error || !data) return null;
    return data;
  });
}

export async function getSharedSectionsForAdmin(schemaKeys: string[]): Promise<CmsSharedSection[]> {
  const normalizedKeys = [...schemaKeys].sort();
  return getAdminReadCached('shared', ['multi', normalizedKeys], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('shared_sections')
      .select('*')
      .in('schema_key', normalizedKeys);

    if (error || !data) return [];
    return data;
  });
}

export async function getGlobalSettingForAdmin<T = unknown>(schemaKey: string): Promise<CmsGlobalSetting<T> | null> {
  return getAdminReadCached('global', ['single', schemaKey], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('global_settings')
      .select('*')
      .eq('schema_key', schemaKey)
      .single();

    if (error || !data) return null;
    return data;
  });
}

export async function getGlobalSettingsForAdmin(schemaKeys: string[]): Promise<CmsGlobalSetting[]> {
  const normalizedKeys = [...schemaKeys].sort();
  return getAdminReadCached('global', ['multi', normalizedKeys], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('global_settings')
      .select('*')
      .in('schema_key', normalizedKeys);

    if (error || !data) return [];
    return data;
  });
}

export async function getRecentCmsAuditLogs(limit = 50): Promise<CmsAuditLog[]> {
  return getAdminReadCached('audit', [limit], async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('cms_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data;
  });
}

interface PageDataBundleOptions {
  slug: string;
  globalSchemaKeys?: {
    header: string;
    footer: string;
  };
  sharedSchemaKeys?: {
    exclusiveTalents: string;
    contactCta: string;
  };
}

async function getPageDataBundle(options: PageDataBundleOptions) {
  const globalSchemaKeys = options.globalSchemaKeys ?? {
    header: SCHEMA_KEYS.GLOBAL_HEADER,
    footer: SCHEMA_KEYS.GLOBAL_FOOTER,
  };

  const sharedSchemaKeys = options.sharedSchemaKeys ?? {
    exclusiveTalents: SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS,
    contactCta: SCHEMA_KEYS.SHARED_CONTACT_CTA,
  };

  const [page, header, footer, exclusiveTalents, contactCta] = await Promise.all([
    getPageBySlug(options.slug),
    getGlobalSetting(globalSchemaKeys.header),
    getGlobalSetting(globalSchemaKeys.footer),
    getSharedSection(sharedSchemaKeys.exclusiveTalents),
    getSharedSection(sharedSchemaKeys.contactCta),
  ]);

  if (!page) return null;

  const sections = await getPageSections(page.id);

  return {
    page,
    sections,
    globals: {
      header,
      footer,
    },
    shared: {
      exclusiveTalents,
      contactCta,
    },
  };
}

export async function getHomePageData() {
  return getPageDataBundle({
    slug: 'home',
  });
}

export async function getForCreatorsPageData() {
  return getPageDataBundle({
    slug: 'for-creators',
  });
}
