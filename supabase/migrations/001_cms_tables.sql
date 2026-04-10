-- Migration: 001_cms_tables.sql
-- Description: Create initial schema for Home CMS: pages, page_sections, shared_sections, global_settings.

CREATE TYPE cms_publish_status AS ENUM ('draft', 'published');

-- Table: pages
-- Stores page-level identity and SEO metadata
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
    -- We use text array for keywords since they are string lists
    keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table: page_sections
-- Stores ordered section instances belonging to a page
CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    schema_key VARCHAR(255) NOT NULL,
    section_key VARCHAR(255) NOT NULL, -- Logical key to differentiate multiple instances, typically schema_key but can be different
    sort_order INTEGER NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (page_id, section_key) -- A given section_key is unique on a single page
);

CREATE INDEX idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX idx_page_sections_sort_order ON page_sections(page_id, sort_order);

-- Table: shared_sections
-- Stores reusable shared content sections
CREATE TABLE IF NOT EXISTS shared_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schema_key VARCHAR(255) NOT NULL UNIQUE,
    section_key VARCHAR(255) NOT NULL UNIQUE, -- For shared, section_key defaults to schema_key
    enabled BOOLEAN NOT NULL DEFAULT true,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table: global_settings
-- Stores site-wide shared configuration
CREATE TABLE IF NOT EXISTS global_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schema_key VARCHAR(255) NOT NULL UNIQUE,
    setting_key VARCHAR(255) NOT NULL UNIQUE, -- For global, setting_key defaults to schema_key
    enabled BOOLEAN NOT NULL DEFAULT true,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Updated_At Moddatetime Triggers
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_pages
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_page_sections
BEFORE UPDATE ON page_sections
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_shared_sections
BEFORE UPDATE ON shared_sections
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_global_settings
BEFORE UPDATE ON global_settings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
