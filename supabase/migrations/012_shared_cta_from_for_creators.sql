-- Migration: 012_shared_cta_from_for_creators.sql
-- Description: Seed new shared CTA section from existing For Creators local CTA section.

DO $$
DECLARE
  source_enabled BOOLEAN;
  source_content JSONB;
BEGIN
  SELECT
    COALESCE(ps.published_enabled, ps.enabled, true),
    COALESCE(ps.published_content, ps.content)
  INTO source_enabled, source_content
  FROM pages p
  JOIN page_sections ps ON ps.page_id = p.id
  WHERE p.slug = 'for-creators'
    AND ps.schema_key = 'for_creators.cta.v1'
  LIMIT 1;

  IF source_content IS NULL THEN
    source_enabled := true;
    source_content := '{
      "heading": "Sẵn Sàng Bắt Đầu\nHành Trình Cùng Chúng Tôi?",
      "subtitle": "Đăng ký ngay hôm nay để trở thành một phần của cộng đồng creator hàng đầu Việt Nam.",
      "cta_label": "Gia nhập 3Brothers",
      "cta_url": "/contact"
    }'::jsonb;
  END IF;

  INSERT INTO shared_sections (
    schema_key,
    section_key,
    enabled,
    content,
    published_content,
    published_enabled,
    has_unpublished_changes
  ) VALUES (
    'shared.cta.v1',
    'shared.cta.v1',
    source_enabled,
    source_content,
    source_content,
    source_enabled,
    false
  )
  ON CONFLICT (schema_key) DO UPDATE
  SET
    enabled = EXCLUDED.enabled,
    content = EXCLUDED.content,
    published_content = EXCLUDED.published_content,
    published_enabled = EXCLUDED.published_enabled,
    has_unpublished_changes = false;
END $$;
