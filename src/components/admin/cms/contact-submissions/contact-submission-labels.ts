import type {
  ContactErrorCategory,
  ContactErrorFilter,
  ContactMailStatus,
} from '@/lib/contact/contact-submissions.types';

export const CONTACT_STATUS_LABELS: Record<ContactMailStatus, string> = {
  success: 'Success',
  error: 'Error',
};

export const CONTACT_STATUS_COLORS: Record<ContactMailStatus, string> = {
  success: 'green',
  error: 'red',
};

export const CONTACT_ERROR_LABELS: Record<ContactErrorFilter, string> = {
  none: 'None',
  missing_config: 'Missing config',
  missing_recipient: 'Missing recipient',
  invalid_contact_channel_config: 'Invalid channel config',
  validation_error: 'Validation error',
  non_actionable_submission: 'Non-actionable',
  missing_smtp_env: 'Missing SMTP env',
  smtp_send_error: 'SMTP send error',
  unknown_error: 'Unknown error',
};

export const CONTACT_ERROR_HINTS: Record<ContactErrorCategory | 'none', string> = {
  none: 'Mail was accepted by the Phase 1 send flow and no error category was recorded.',
  missing_config: 'Check Contact Page global setting and publish valid content.',
  missing_recipient: 'Add a valid recipient email and publish Contact Page settings.',
  invalid_contact_channel_config: 'Enable at least email or phone in Contact Page settings.',
  validation_error: 'Submitted payload failed shared basic validation.',
  non_actionable_submission: 'Submission lacked both email and phone.',
  missing_smtp_env: 'Fix deployment SMTP environment and verify delivery.',
  smtp_send_error: 'Check SMTP credentials or provider status without exposing provider errors.',
  unknown_error: 'Inspect server logs carefully without exposing PII.',
};

export function getErrorFilterLabel(value: ContactErrorFilter | null): string {
  if (!value) return 'All categories';
  return CONTACT_ERROR_LABELS[value] ?? 'Unknown';
}

export function getErrorCategoryLabel(value: ContactErrorCategory | null): string {
  return value ? CONTACT_ERROR_LABELS[value] ?? 'Unknown' : CONTACT_ERROR_LABELS.none;
}

export function getErrorCategoryColor(value: ContactErrorCategory | null): string {
  if (!value) return 'default';
  if (value === 'missing_smtp_env' || value === 'smtp_send_error') return 'red';
  if (value === 'missing_config' || value === 'missing_recipient' || value === 'invalid_contact_channel_config') {
    return 'orange';
  }
  return 'blue';
}

export function truncateMessage(value: string | null, maxLength = 120): string {
  if (!value) return '';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export function formatContactDate(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(value));
}
