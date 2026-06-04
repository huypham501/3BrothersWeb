import { createSupabaseServerClient } from '../../supabase/server';
import { createSupabasePublicClient } from '../../supabase/public-client';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import { getAdminReadCached } from '../admin-read-cache';
import type {
  CmsAuditActionType,
  CmsAuditEntityType,
  CmsPage,
  CmsPageSection,
  CmsSharedSection,
  CmsGlobalSetting,
  CmsAuditLog,
} from '../types';
import { CMS_AUDIT_ACTION_TYPES, CMS_AUDIT_ENTITY_TYPES } from '../types';

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

type RawSearchParams = Record<string, string | string[] | undefined>;
type SupabaseQueryResult = {
  data?: unknown;
  count?: number | null;
  error?: { message?: string } | null;
};
type SupabaseFilterQuery = {
  eq(column: string, value: string): SupabaseFilterQuery;
  ilike(column: string, pattern: string): SupabaseFilterQuery;
  gte(column: string, value: string): SupabaseFilterQuery;
  lt(column: string, value: string): SupabaseFilterQuery;
  or(filters: string): SupabaseFilterQuery;
};

export type CmsAuditLogListParams = {
  page: number;
  pageSize: number;
  actionType: CmsAuditActionType | null;
  entityType: CmsAuditEntityType | null;
  actorSearch: string | null;
  entitySearch: string | null;
  createdFrom: string | null;
  createdTo: string | null;
};

export type CmsAuditLogListResult = {
  rows: CmsAuditLog[];
  params: CmsAuditLogListParams;
  total: number;
  error: string | null;
};

const DEFAULT_AUDIT_PAGE = 1;
const DEFAULT_AUDIT_PAGE_SIZE = 25;
const MAX_AUDIT_PAGE_SIZE = 100;
const HCM_UTC_OFFSET_MS = 7 * 60 * 60 * 1000;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return parsed;
}

function parseAuditPageSize(value: string | undefined): number {
  return Math.min(parsePositiveInt(value, DEFAULT_AUDIT_PAGE_SIZE), MAX_AUDIT_PAGE_SIZE);
}

function parseDateParam(value: string | undefined): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  const testDate = new Date(Date.UTC(year, month - 1, day));
  if (
    testDate.getUTCFullYear() !== year ||
    testDate.getUTCMonth() !== month - 1 ||
    testDate.getUTCDate() !== day
  ) {
    return null;
  }

  return value;
}

function hcmDateToUtcIso(value: string, addDays = 0): string {
  const [year, month, day] = value.split('-').map(Number);
  const utc = Date.UTC(year, month - 1, day + addDays) - HCM_UTC_OFFSET_MS;
  return new Date(utc).toISOString();
}

function parseSearchText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 120);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isAuditActionType(value: string | undefined): value is CmsAuditActionType {
  return CMS_AUDIT_ACTION_TYPES.includes(value as CmsAuditActionType);
}

function isAuditEntityType(value: string | undefined): value is CmsAuditEntityType {
  return CMS_AUDIT_ENTITY_TYPES.includes(value as CmsAuditEntityType);
}

export function parseCmsAuditLogListParams(searchParams: RawSearchParams | undefined): CmsAuditLogListParams {
  const actionType = firstParam(searchParams?.action_type);
  const entityType = firstParam(searchParams?.entity_type);

  return {
    page: parsePositiveInt(firstParam(searchParams?.page), DEFAULT_AUDIT_PAGE),
    pageSize: parseAuditPageSize(firstParam(searchParams?.pageSize)),
    actionType: isAuditActionType(actionType) ? actionType : null,
    entityType: isAuditEntityType(entityType) ? entityType : null,
    actorSearch: parseSearchText(firstParam(searchParams?.actor)),
    entitySearch: parseSearchText(firstParam(searchParams?.entity)),
    createdFrom: parseDateParam(firstParam(searchParams?.createdFrom)),
    createdTo: parseDateParam(firstParam(searchParams?.createdTo)),
  };
}

function applyCmsAuditLogFilters(
  query: SupabaseFilterQuery,
  params: CmsAuditLogListParams
): SupabaseFilterQuery {
  let filtered = query;

  if (params.actionType) {
    filtered = filtered.eq('action_type', params.actionType);
  }

  if (params.entityType) {
    filtered = filtered.eq('entity_type', params.entityType);
  }

  if (params.actorSearch) {
    filtered = isUuid(params.actorSearch)
      ? filtered.or(`actor_user_id.eq.${params.actorSearch},actor_email_or_identifier.ilike.%${params.actorSearch}%`)
      : filtered.ilike('actor_email_or_identifier', `%${params.actorSearch}%`);
  }

  if (params.entitySearch) {
    filtered = isUuid(params.entitySearch)
      ? filtered.or(`entity_id.eq.${params.entitySearch},entity_key_or_id.ilike.%${params.entitySearch}%`)
      : filtered.ilike('entity_key_or_id', `%${params.entitySearch}%`);
  }

  if (params.createdFrom) {
    filtered = filtered.gte('created_at', hcmDateToUtcIso(params.createdFrom));
  }

  if (params.createdTo) {
    filtered = filtered.lt('created_at', hcmDateToUtcIso(params.createdTo, 1));
  }

  return filtered;
}

export async function getCmsAuditLogList(searchParams?: RawSearchParams): Promise<CmsAuditLogListResult> {
  const parsedParams = parseCmsAuditLogListParams(searchParams);
  const supabase = await createSupabaseServerClient();
  const countQueryBase = supabase
    .from('cms_audit_logs')
    .select('id', { count: 'exact', head: true }) as unknown as SupabaseFilterQuery;
  const countQuery = applyCmsAuditLogFilters(
    countQueryBase,
    parsedParams
  );
  const { count, error: countError } = await (countQuery as unknown as PromiseLike<SupabaseQueryResult>);

  if (countError) {
    return {
      rows: [],
      params: { ...parsedParams, page: DEFAULT_AUDIT_PAGE },
      total: 0,
      error: 'Failed to count CMS audit logs.',
    };
  }

  const total = count ?? 0;
  const pageCount = total > 0 ? Math.ceil(total / parsedParams.pageSize) : 1;
  const page = total > 0 ? Math.min(parsedParams.page, pageCount) : DEFAULT_AUDIT_PAGE;
  const params = { ...parsedParams, page };
  const from = (page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  const listQueryBase = supabase
    .from('cms_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(from, to) as unknown as SupabaseFilterQuery;
  const listQuery = applyCmsAuditLogFilters(listQueryBase, params);
  const { data, error: listError } = await (listQuery as unknown as PromiseLike<SupabaseQueryResult>);

  if (listError) {
    return {
      rows: [],
      params,
      total,
      error: 'Failed to load CMS audit logs.',
    };
  }

  return {
    rows: (data ?? []) as CmsAuditLog[],
    params,
    total,
    error: null,
  };
}

export function buildCmsAuditLogListPath(params: CmsAuditLogListParams): string {
  const query = new URLSearchParams();

  if (params.page !== DEFAULT_AUDIT_PAGE) query.set('page', String(params.page));
  if (params.pageSize !== DEFAULT_AUDIT_PAGE_SIZE) query.set('pageSize', String(params.pageSize));
  if (params.actionType) query.set('action_type', params.actionType);
  if (params.entityType) query.set('entity_type', params.entityType);
  if (params.actorSearch) query.set('actor', params.actorSearch);
  if (params.entitySearch) query.set('entity', params.entitySearch);
  if (params.createdFrom) query.set('createdFrom', params.createdFrom);
  if (params.createdTo) query.set('createdTo', params.createdTo);

  const qs = query.toString();
  return qs ? `/admin/content/audit?${qs}` : '/admin/content/audit';
}

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

export async function getSocialCommercePageData() {
  return getPageDataBundle({
    slug: 'social-commerce',
  });
}

export async function getForBrandsPageData() {
  return getPageDataBundle({
    slug: 'for-brands',
  });
}
