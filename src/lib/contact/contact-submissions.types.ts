export const CONTACT_ERROR_CATEGORIES = [
  'missing_config',
  'missing_recipient',
  'invalid_contact_channel_config',
  'validation_error',
  'non_actionable_submission',
  'missing_smtp_env',
  'smtp_send_error',
  'unknown_error',
] as const;

export type ContactErrorCategory = (typeof CONTACT_ERROR_CATEGORIES)[number];
export type ContactMailStatus = 'success' | 'error';
export type ContactErrorFilter = ContactErrorCategory | 'none';

export type ContactSubmissionRow = {
  id: string;
  fullname: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  enabled_field_snapshot: Record<string, unknown> | null;
  mail_status: ContactMailStatus;
  error_category: ContactErrorCategory | null;
  created_at: string;
  updated_at: string;
};

export type ContactSubmissionListParams = {
  page: number;
  pageSize: number;
  mailStatus: ContactMailStatus | null;
  errorCategory: ContactErrorFilter | null;
  createdFrom: string | null;
  createdTo: string | null;
};

export type ContactSubmissionSummary = {
  total: number;
  success: number;
  error: number;
  byCategory: Record<ContactErrorFilter, number>;
};
