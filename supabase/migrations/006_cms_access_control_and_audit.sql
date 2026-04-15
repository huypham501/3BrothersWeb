-- Migration: 006_cms_access_control_and_audit.sql
-- Description: Add CMS role mapping, audit logs, and change metadata columns.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_role') THEN
    CREATE TYPE cms_role AS ENUM ('super_admin', 'content_admin', 'editor', 'viewer');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS cms_user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role cms_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_user_roles_role ON cms_user_roles(role);

-- Bootstrap existing authenticated users as super_admin to avoid lockout after migration.
INSERT INTO cms_user_roles (user_id, email, role)
SELECT id, email, 'super_admin'::cms_role
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_audit_action') THEN
    CREATE TYPE cms_audit_action AS ENUM ('save_draft', 'publish');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_audit_entity_type') THEN
    CREATE TYPE cms_audit_entity_type AS ENUM ('page', 'page_section', 'shared_section', 'global_setting');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS cms_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  actor_email_or_identifier TEXT NOT NULL,
  actor_role cms_role NOT NULL,
  action_type cms_audit_action NOT NULL,
  entity_type cms_audit_entity_type NOT NULL,
  entity_id UUID,
  entity_key_or_id TEXT NOT NULL,
  page_slug_or_schema_key TEXT,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_created_at ON cms_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_action_type ON cms_audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_entity_type ON cms_audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_actor_user_id ON cms_audit_logs(actor_user_id);

ALTER TABLE pages
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_edited_by_identifier TEXT,
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_published_by_identifier TEXT,
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE page_sections
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_edited_by_identifier TEXT,
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_published_by_identifier TEXT,
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE shared_sections
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_edited_by_identifier TEXT,
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_published_by_identifier TEXT,
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE global_settings
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_edited_by_identifier TEXT,
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_published_by_identifier TEXT,
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMP WITH TIME ZONE;

CREATE TRIGGER set_timestamp_cms_user_roles
BEFORE UPDATE ON cms_user_roles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
