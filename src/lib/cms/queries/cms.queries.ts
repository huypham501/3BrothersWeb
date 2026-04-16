import { createSupabaseServerClient } from '../../supabase/server';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import type {
  CmsPage, 
  CmsPageSection, 
  CmsSharedSection, 
  CmsGlobalSetting,
  CmsAuditLog,
} from '../types';

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getPageSections(pageId: string): Promise<CmsPageSection[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getSharedSection<T = unknown>(schemaKey: string): Promise<CmsSharedSection<T> | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shared_sections')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getSharedSectionForAdmin<T = unknown>(schemaKey: string): Promise<CmsSharedSection<T> | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shared_sections')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getSharedSectionsForAdmin(schemaKeys: string[]): Promise<CmsSharedSection[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shared_sections')
    .select('*')
    .in('schema_key', schemaKeys);

  if (error || !data) return [];
  return data;
}

export async function getGlobalSetting<T = unknown>(schemaKey: string): Promise<CmsGlobalSetting<T> | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('global_settings')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getGlobalSettingForAdmin<T = unknown>(schemaKey: string): Promise<CmsGlobalSetting<T> | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('global_settings')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getGlobalSettingsForAdmin(schemaKeys: string[]): Promise<CmsGlobalSetting[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('global_settings')
    .select('*')
    .in('schema_key', schemaKeys);

  if (error || !data) return [];
  return data;
}

export async function getRecentCmsAuditLogs(limit = 50): Promise<CmsAuditLog[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('cms_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
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
  const page = await getPageBySlug(options.slug);
  if (!page) return null;

  const sections = await getPageSections(page.id);

  const globalSchemaKeys = options.globalSchemaKeys ?? {
    header: SCHEMA_KEYS.GLOBAL_HEADER,
    footer: SCHEMA_KEYS.GLOBAL_FOOTER,
  };

  const sharedSchemaKeys = options.sharedSchemaKeys ?? {
    exclusiveTalents: SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS,
    contactCta: SCHEMA_KEYS.SHARED_CONTACT_CTA,
  };

  const [header, footer, exclusiveTalents, contactCta] = await Promise.all([
    getGlobalSetting(globalSchemaKeys.header),
    getGlobalSetting(globalSchemaKeys.footer),
    getSharedSection(sharedSchemaKeys.exclusiveTalents),
    getSharedSection(sharedSchemaKeys.contactCta),
  ]);

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
