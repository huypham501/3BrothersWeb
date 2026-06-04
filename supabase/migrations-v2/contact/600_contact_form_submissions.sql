-- Create protected contact form submission log.

CREATE TABLE IF NOT EXISTS contact_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fullname TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  enabled_field_snapshot JSONB,
  mail_status TEXT NOT NULL CHECK (mail_status IN ('success', 'error')),
  error_category TEXT CHECK (
    error_category IS NULL OR error_category IN (
      'missing_config',
      'missing_recipient',
      'invalid_contact_channel_config',
      'validation_error',
      'non_actionable_submission',
      'missing_smtp_env',
      'smtp_send_error',
      'unknown_error'
    )
  ),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_created_at
ON contact_form_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_mail_status
ON contact_form_submissions(mail_status);

CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_error_category
ON contact_form_submissions(error_category);

ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_timestamp_contact_form_submissions'
      AND tgrelid = 'contact_form_submissions'::regclass
  ) THEN
    CREATE TRIGGER set_timestamp_contact_form_submissions
    BEFORE UPDATE ON contact_form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;
