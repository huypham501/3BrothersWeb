import type { CmsAuditActionType, CmsAuditEntityType } from '@/lib/cms';

export const AUDIT_ACTION_LABELS: Record<CmsAuditActionType, string> = {
  publish: 'Publish',
  save_draft: 'Save Draft',
};

export const AUDIT_ACTION_COLORS: Record<CmsAuditActionType, string> = {
  publish: 'green',
  save_draft: 'orange',
};

export const AUDIT_ENTITY_LABELS: Record<CmsAuditEntityType, string> = {
  page: 'Page',
  page_section: 'Page Section',
  shared_section: 'Shared Section',
  global_setting: 'Global Setting',
  blog_post: 'Blog Post',
  job_position: 'Job Position',
};

export function formatAuditDate(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function truncateAuditSummary(value: string, maxLength = 120): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}
