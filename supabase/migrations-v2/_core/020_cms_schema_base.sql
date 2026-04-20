-- Canonical base schema with publish and audit columns merged into CREATE definitions.

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  internal_name VARCHAR(80) NOT NULL,
  status cms_publish_status NOT NULL DEFAULT 'draft',
  seo_title VARCHAR(70) NOT NULL,
  seo_description VARCHAR(160) NOT NULL,
  og_image VARCHAR(1024),
  og_image_alt VARCHAR(125),
  canonical_url VARCHAR(1024),
  keywords TEXT[] DEFAULT '{}',
  published_seo_title VARCHAR(70),
  published_seo_description VARCHAR(160),
  published_og_image VARCHAR(1024),
  published_og_image_alt VARCHAR(125),
  published_keywords TEXT[],
  has_unpublished_changes BOOLEAN DEFAULT false,
  last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_edited_by_identifier TEXT,
  last_edited_at TIMESTAMP WITH TIME ZONE,
  last_published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_published_by_identifier TEXT,
  last_published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  schema_key VARCHAR(255) NOT NULL,
  section_key VARCHAR(255) NOT NULL,
  sort_order INTEGER NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB,
  published_enabled BOOLEAN,
  has_unpublished_changes BOOLEAN DEFAULT false,
  last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_edited_by_identifier TEXT,
  last_edited_at TIMESTAMP WITH TIME ZONE,
  last_published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_published_by_identifier TEXT,
  last_published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (page_id, section_key)
);

CREATE TABLE IF NOT EXISTS shared_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schema_key VARCHAR(255) NOT NULL UNIQUE,
  section_key VARCHAR(255) NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB,
  published_enabled BOOLEAN,
  has_unpublished_changes BOOLEAN DEFAULT false,
  last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_edited_by_identifier TEXT,
  last_edited_at TIMESTAMP WITH TIME ZONE,
  last_published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_published_by_identifier TEXT,
  last_published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schema_key VARCHAR(255) NOT NULL UNIQUE,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB,
  published_enabled BOOLEAN,
  has_unpublished_changes BOOLEAN DEFAULT false,
  last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_edited_by_identifier TEXT,
  last_edited_at TIMESTAMP WITH TIME ZONE,
  last_published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_published_by_identifier TEXT,
  last_published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role cms_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

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

CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_sort_order ON page_sections(page_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_cms_user_roles_role ON cms_user_roles(role);
CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_created_at ON cms_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_action_type ON cms_audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_entity_type ON cms_audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_cms_audit_logs_actor_user_id ON cms_audit_logs(actor_user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_timestamp_pages'
      AND tgrelid = 'pages'::regclass
  ) THEN
    CREATE TRIGGER set_timestamp_pages
    BEFORE UPDATE ON pages
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_timestamp_page_sections'
      AND tgrelid = 'page_sections'::regclass
  ) THEN
    CREATE TRIGGER set_timestamp_page_sections
    BEFORE UPDATE ON page_sections
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_timestamp_shared_sections'
      AND tgrelid = 'shared_sections'::regclass
  ) THEN
    CREATE TRIGGER set_timestamp_shared_sections
    BEFORE UPDATE ON shared_sections
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_timestamp_global_settings'
      AND tgrelid = 'global_settings'::regclass
  ) THEN
    CREATE TRIGGER set_timestamp_global_settings
    BEFORE UPDATE ON global_settings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_timestamp_cms_user_roles'
      AND tgrelid = 'cms_user_roles'::regclass
  ) THEN
    CREATE TRIGGER set_timestamp_cms_user_roles
    BEFORE UPDATE ON cms_user_roles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;
