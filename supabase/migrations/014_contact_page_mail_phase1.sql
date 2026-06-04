-- Migration: 014_contact_page_mail_phase1.sql
-- Description: Seed contact page global setting and create protected contact form submission log.

INSERT INTO global_settings (
  schema_key,
  setting_key,
  enabled,
  content,
  published_content,
  published_enabled,
  has_unpublished_changes
) VALUES (
  'global.contact_page.v1',
  'global.contact_page.v1',
  true,
  '{
    "eyebrow": "Đừng ngần ngại",
    "title": "LIÊN HỆ NGAY ĐỂ NHẬN TƯ VẤN",
    "submit_label": "Liên hệ tư vấn",
    "success_message": "Cảm ơn bạn đã liên hệ. 3Brothers sẽ phản hồi trong thời gian sớm nhất.",
    "error_message": "Hiện chưa thể gửi thông tin liên hệ. Vui lòng thử lại sau.",
    "fields": {
      "fullname": {"enabled": true, "label": "Họ Tên", "placeholder": "Họ Tên", "required": true},
      "email": {"enabled": true, "label": "Email", "placeholder": "Email", "required": false},
      "phone": {"enabled": true, "label": "Số điện thoại", "placeholder": "Số điện thoại", "required": false},
      "message": {"enabled": true, "label": "Lời nhắn", "placeholder": "Lời nhắn", "required": false}
    },
    "recipient_email": "work.3brothers@gmail.com",
    "email_subject_prefix": "[3Brothers Contact]"
  }'::jsonb,
  '{
    "eyebrow": "Đừng ngần ngại",
    "title": "LIÊN HỆ NGAY ĐỂ NHẬN TƯ VẤN",
    "submit_label": "Liên hệ tư vấn",
    "success_message": "Cảm ơn bạn đã liên hệ. 3Brothers sẽ phản hồi trong thời gian sớm nhất.",
    "error_message": "Hiện chưa thể gửi thông tin liên hệ. Vui lòng thử lại sau.",
    "fields": {
      "fullname": {"enabled": true, "label": "Họ Tên", "placeholder": "Họ Tên", "required": true},
      "email": {"enabled": true, "label": "Email", "placeholder": "Email", "required": false},
      "phone": {"enabled": true, "label": "Số điện thoại", "placeholder": "Số điện thoại", "required": false},
      "message": {"enabled": true, "label": "Lời nhắn", "placeholder": "Lời nhắn", "required": false}
    },
    "recipient_email": "work.3brothers@gmail.com",
    "email_subject_prefix": "[3Brothers Contact]"
  }'::jsonb,
  true,
  false
)
ON CONFLICT (schema_key) DO NOTHING;

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
