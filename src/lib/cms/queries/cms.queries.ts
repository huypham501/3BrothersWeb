import { createSupabaseServerClient } from '../../supabase/server';
import { 
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

export async function getSharedSection(schemaKey: string): Promise<CmsSharedSection | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shared_sections')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getSharedSectionForAdmin(schemaKey: string): Promise<CmsSharedSection | null> {
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

export async function getGlobalSetting(schemaKey: string): Promise<CmsGlobalSetting | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('global_settings')
    .select('*')
    .eq('schema_key', schemaKey)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getGlobalSettingForAdmin(schemaKey: string): Promise<CmsGlobalSetting | null> {
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

export async function getHomePageData() {
  const page = await getPageBySlug('home');
  if (!page) return null;

  const sections = await getPageSections(page.id);

  // Home specifically needs these shared / global records according to spec
  const [header, footer, exclusiveTalents, contactCta] = await Promise.all([
    getGlobalSetting('global.header.v1'),
    getGlobalSetting('global.footer.v1'),
    getSharedSection('shared.exclusive_talents.v1'),
    getSharedSection('shared.contact_cta.v1'),
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
    }
  };
}

export async function getForCreatorsPageData() {
  const page = await getPageBySlug('for-creators');
  if (!page) return null;

  const sections = await getPageSections(page.id);

  const [header, footer, exclusiveTalents, contactCta] = await Promise.all([
    getGlobalSetting('global.header.v1'),
    getGlobalSetting('global.footer.v1'),
    getSharedSection('shared.exclusive_talents.v1'),
    getSharedSection('shared.contact_cta.v1'),
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
