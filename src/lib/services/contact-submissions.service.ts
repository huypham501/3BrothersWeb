import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import type { ContactFormValues } from '@/lib/validations';

export type ContactMailStatus = 'success' | 'error';

export type ContactErrorCategory =
  | 'missing_config'
  | 'missing_recipient'
  | 'invalid_contact_channel_config'
  | 'validation_error'
  | 'non_actionable_submission'
  | 'missing_smtp_env'
  | 'smtp_send_error'
  | 'unknown_error';

export type ContactFieldSnapshot = {
  fullname: { enabled: boolean; required: boolean };
  email: { enabled: boolean; required: boolean };
  phone: { enabled: boolean; required: boolean };
  message: { enabled: boolean; required: boolean };
};

interface CreateContactSubmissionInput {
  values: ContactFormValues;
  enabledFieldSnapshot: ContactFieldSnapshot | null;
  mailStatus: ContactMailStatus;
  errorCategory: ContactErrorCategory | null;
}

export async function createContactSubmissionLog(input: CreateContactSubmissionInput): Promise<void> {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from('contact_form_submissions').insert({
    fullname: input.values.fullname || null,
    email: input.values.email || null,
    phone: input.values.phone || null,
    message: input.values.message || null,
    enabled_field_snapshot: input.enabledFieldSnapshot,
    mail_status: input.mailStatus,
    error_category: input.errorCategory,
  });

  if (error) {
    throw new Error(`Failed to persist contact submission log: ${error.message}`);
  }
}
