import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import {
  CONTACT_ERROR_CATEGORIES,
  type ContactErrorCategory,
  type ContactErrorFilter,
  type ContactMailStatus,
  type ContactSubmissionListParams,
  type ContactSubmissionRow,
  type ContactSubmissionSummary,
} from './contact-submissions.types';

export { CONTACT_ERROR_CATEGORIES };
export type {
  ContactErrorCategory,
  ContactErrorFilter,
  ContactMailStatus,
  ContactSubmissionListParams,
  ContactSubmissionRow,
  ContactSubmissionSummary,
};

export type ContactSubmissionListResult = {
  rows: ContactSubmissionRow[];
  params: ContactSubmissionListParams;
  total: number;
  summary: ContactSubmissionSummary;
};

type RawSearchParams = Record<string, string | string[] | undefined>;
type SupabaseFilterQuery = any;

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;
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

function parsePageSize(value: string | undefined): number {
  return Math.min(parsePositiveInt(value, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
}

function isMailStatus(value: string | undefined): value is ContactMailStatus {
  return value === 'success' || value === 'error';
}

function isErrorCategory(value: string | undefined): value is ContactErrorCategory {
  return CONTACT_ERROR_CATEGORIES.includes(value as ContactErrorCategory);
}

function parseErrorFilter(value: string | undefined): ContactErrorFilter | null {
  if (value === 'none') return 'none';
  if (isErrorCategory(value)) return value;
  return null;
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

export function parseContactSubmissionListParams(
  searchParams: RawSearchParams | undefined
): ContactSubmissionListParams {
  const status = firstParam(searchParams?.mail_status);

  return {
    page: parsePositiveInt(firstParam(searchParams?.page), DEFAULT_PAGE),
    pageSize: parsePageSize(firstParam(searchParams?.pageSize)),
    mailStatus: isMailStatus(status) ? status : null,
    errorCategory: parseErrorFilter(firstParam(searchParams?.error_category)),
    createdFrom: parseDateParam(firstParam(searchParams?.createdFrom)),
    createdTo: parseDateParam(firstParam(searchParams?.createdTo)),
  };
}

function applyContactSubmissionFilters(
  query: SupabaseFilterQuery,
  params: ContactSubmissionListParams,
  overrides: {
    mailStatus?: ContactMailStatus;
    errorCategory?: ContactErrorFilter;
  } = {}
): SupabaseFilterQuery {
  let filtered = query;
  const mailStatus = overrides.mailStatus ?? params.mailStatus;
  const errorCategory = overrides.errorCategory ?? params.errorCategory;

  if (mailStatus) {
    filtered = filtered.eq('mail_status', mailStatus);
  }

  if (errorCategory === 'none') {
    filtered = filtered.is('error_category', null);
  } else if (errorCategory) {
    filtered = filtered.eq('error_category', errorCategory);
  }

  if (params.createdFrom) {
    filtered = filtered.gte('created_at', hcmDateToUtcIso(params.createdFrom));
  }

  if (params.createdTo) {
    filtered = filtered.lt('created_at', hcmDateToUtcIso(params.createdTo, 1));
  }

  return filtered;
}

async function countSubmissions(
  params: ContactSubmissionListParams,
  overrides: {
    mailStatus?: ContactMailStatus;
    errorCategory?: ContactErrorFilter;
  } = {}
): Promise<number> {
  const supabase = createSupabaseServiceRoleClient();
  const query = applyContactSubmissionFilters(
    supabase.from('contact_form_submissions').select('id', { count: 'exact', head: true }),
    params,
    overrides
  );
  const { count, error } = await query;

  if (error) {
    throw new Error('Failed to count contact submissions.');
  }

  return count ?? 0;
}

export async function getContactSubmissionList(
  searchParams?: RawSearchParams
): Promise<ContactSubmissionListResult> {
  const parsedParams = parseContactSubmissionListParams(searchParams);
  const total = await countSubmissions(parsedParams);
  const pageCount = total > 0 ? Math.ceil(total / parsedParams.pageSize) : 1;
  const page = total > 0 ? Math.min(parsedParams.page, pageCount) : DEFAULT_PAGE;
  const params = { ...parsedParams, page };
  const from = (page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  const supabase = createSupabaseServiceRoleClient();
  const listQuery = applyContactSubmissionFilters(
    supabase
      .from('contact_form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, to),
    params
  );
  const { data, error } = await listQuery;

  if (error) {
    throw new Error('Failed to load contact submissions.');
  }

  const categoryCounts = await Promise.all(
    (['none', ...CONTACT_ERROR_CATEGORIES] as ContactErrorFilter[]).map(async (category) => {
      const count = await countSubmissions(params, { errorCategory: category });
      return [category, count] as const;
    })
  );

  const [success, errorCount] = await Promise.all([
    countSubmissions(params, { mailStatus: 'success' }),
    countSubmissions(params, { mailStatus: 'error' }),
  ]);

  return {
    rows: (data ?? []) as ContactSubmissionRow[],
    params,
    total,
    summary: {
      total,
      success,
      error: errorCount,
      byCategory: Object.fromEntries(categoryCounts) as Record<ContactErrorFilter, number>,
    },
  };
}

export async function getContactSubmissionById(
  id: string
): Promise<ContactSubmissionRow | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from('contact_form_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return data as ContactSubmissionRow;
}

export function buildContactSubmissionsListPath(params: ContactSubmissionListParams): string {
  const query = new URLSearchParams();

  if (params.page !== DEFAULT_PAGE) query.set('page', String(params.page));
  if (params.pageSize !== DEFAULT_PAGE_SIZE) query.set('pageSize', String(params.pageSize));
  if (params.mailStatus) query.set('mail_status', params.mailStatus);
  if (params.errorCategory) query.set('error_category', params.errorCategory);
  if (params.createdFrom) query.set('createdFrom', params.createdFrom);
  if (params.createdTo) query.set('createdTo', params.createdTo);

  const qs = query.toString();
  return qs ? `/admin/content/contact-submissions?${qs}` : '/admin/content/contact-submissions';
}

export function getSafeContactSubmissionsReturnTo(value: string | string[] | undefined): string {
  const raw = firstParam(value);
  if (!raw) return '/admin/content/contact-submissions';

  try {
    const parsed = new URL(raw, 'https://admin.local');
    if (
      parsed.origin === 'https://admin.local' &&
      parsed.pathname === '/admin/content/contact-submissions'
    ) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    return '/admin/content/contact-submissions';
  }

  return '/admin/content/contact-submissions';
}
