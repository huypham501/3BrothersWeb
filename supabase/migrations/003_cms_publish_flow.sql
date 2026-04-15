-- Migration: 003_cms_publish_flow.sql
-- Description: Add draft/publish parallel columns to CMS tables

-- 1. Alter Pages Table
ALTER TABLE pages
ADD COLUMN IF NOT EXISTS published_seo_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS published_seo_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS published_og_image VARCHAR(1024),
ADD COLUMN IF NOT EXISTS published_og_image_alt VARCHAR(125),
ADD COLUMN IF NOT EXISTS published_keywords TEXT[],
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT false;

UPDATE pages SET
    published_seo_title = seo_title,
    published_seo_description = seo_description,
    published_og_image = og_image,
    published_og_image_alt = og_image_alt,
    published_keywords = keywords,
    has_unpublished_changes = false;

-- 2. Alter Page Sections Table
ALTER TABLE page_sections
ADD COLUMN IF NOT EXISTS published_content JSONB,
ADD COLUMN IF NOT EXISTS published_enabled BOOLEAN,
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT false;

UPDATE page_sections SET
    published_content = content,
    published_enabled = enabled,
    has_unpublished_changes = false;

-- 3. Alter Shared Sections Table
ALTER TABLE shared_sections
ADD COLUMN IF NOT EXISTS published_content JSONB,
ADD COLUMN IF NOT EXISTS published_enabled BOOLEAN,
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT false;

UPDATE shared_sections SET
    published_content = content,
    published_enabled = enabled,
    has_unpublished_changes = false;

-- 4. Alter Global Settings Table
ALTER TABLE global_settings
ADD COLUMN IF NOT EXISTS published_content JSONB,
ADD COLUMN IF NOT EXISTS published_enabled BOOLEAN,
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT false;

UPDATE global_settings SET
    published_content = content,
    published_enabled = enabled,
    has_unpublished_changes = false;
