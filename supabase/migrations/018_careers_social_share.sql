-- Migration: 018_careers_social_share.sql
-- Description: Add CMS-managed social share config for career detail pages.

DO $$
DECLARE
  careers_page_id UUID;
BEGIN
  SELECT id INTO careers_page_id FROM pages WHERE slug = 'careers';

  IF careers_page_id IS NULL THEN
    RAISE NOTICE 'Careers page not found. Skipping careers social share seed.';
    RETURN;
  END IF;

  INSERT INTO page_sections (
    page_id, schema_key, section_key, sort_order, enabled,
    content, published_content, published_enabled, has_unpublished_changes
  ) VALUES (
    careers_page_id,
    'careers.social_share.v1',
    'careers.social_share.v1',
    2,
    true,
    '{
      "enabled": true,
      "share_label": "Chia sẻ vị trí này",
      "platforms": [
        {
          "id": "facebook",
          "label": "Facebook",
          "enabled": true,
          "url_template": "https://www.facebook.com/sharer/sharer.php?u={url}"
        },
        {
          "id": "twitter",
          "label": "Twitter",
          "enabled": true,
          "url_template": "https://twitter.com/intent/tweet?url={url}&text={title}"
        },
        {
          "id": "instagram",
          "label": "Instagram",
          "enabled": true,
          "url_template": ""
        }
      ]
    }'::jsonb,
    '{
      "enabled": true,
      "share_label": "Chia sẻ vị trí này",
      "platforms": [
        {
          "id": "facebook",
          "label": "Facebook",
          "enabled": true,
          "url_template": "https://www.facebook.com/sharer/sharer.php?u={url}"
        },
        {
          "id": "twitter",
          "label": "Twitter",
          "enabled": true,
          "url_template": "https://twitter.com/intent/tweet?url={url}&text={title}"
        },
        {
          "id": "instagram",
          "label": "Instagram",
          "enabled": true,
          "url_template": ""
        }
      ]
    }'::jsonb,
    true,
    false
  )
  ON CONFLICT (page_id, section_key) DO UPDATE SET
    schema_key = EXCLUDED.schema_key,
    sort_order = EXCLUDED.sort_order,
    enabled = page_sections.enabled,
    content = COALESCE(page_sections.content, EXCLUDED.content),
    published_content = COALESCE(page_sections.published_content, EXCLUDED.published_content),
    published_enabled = COALESCE(page_sections.published_enabled, EXCLUDED.published_enabled),
    has_unpublished_changes = page_sections.has_unpublished_changes;
END $$;
