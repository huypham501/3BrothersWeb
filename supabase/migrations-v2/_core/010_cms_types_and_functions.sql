-- Canonical core enums and shared trigger function.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_publish_status') THEN
    CREATE TYPE cms_publish_status AS ENUM ('draft', 'published');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_role') THEN
    CREATE TYPE cms_role AS ENUM ('super_admin', 'content_admin', 'editor', 'viewer');
  END IF;
END $$;

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

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
