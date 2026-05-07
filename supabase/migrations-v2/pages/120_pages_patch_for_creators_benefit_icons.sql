-- Migration: Backfill icon_image/icon_image_alt for for_creators.benefit.v1
-- Applies to both draft (content) and published (published_content).

WITH icon_map AS (
  SELECT *
  FROM (VALUES
    ('income', '/images/for-creators/benefits/income.svg', 'Icon tăng trưởng thu nhập'),
    ('brand', '/images/for-creators/benefits/brand.svg', 'Icon kết nối nhãn hàng'),
    ('management', '/images/for-creators/benefits/management.svg', 'Icon quản lý chuyên nghiệp'),
    ('content', '/images/for-creators/benefits/content.svg', 'Icon hỗ trợ nội dung')
  ) AS t(id, icon_image, icon_image_alt)
),
patched AS (
  SELECT
    ps.id,
    CASE
      WHEN ps.content ? 'benefits' THEN
        jsonb_set(
          ps.content,
          '{benefits}',
          (
            SELECT jsonb_agg(
              jsonb_set(
                jsonb_set(
                  benefit_item,
                  '{icon_image}',
                  to_jsonb(COALESCE(NULLIF(benefit_item->>'icon_image', ''), im.icon_image))
                ),
                '{icon_image_alt}',
                to_jsonb(COALESCE(NULLIF(benefit_item->>'icon_image_alt', ''), im.icon_image_alt))
              )
              ORDER BY ord
            )
            FROM jsonb_array_elements(ps.content->'benefits') WITH ORDINALITY AS arr(benefit_item, ord)
            LEFT JOIN icon_map im ON im.id = arr.benefit_item->>'id'
          )
        )
      ELSE ps.content
    END AS next_content,
    CASE
      WHEN ps.published_content ? 'benefits' THEN
        jsonb_set(
          ps.published_content,
          '{benefits}',
          (
            SELECT jsonb_agg(
              jsonb_set(
                jsonb_set(
                  benefit_item,
                  '{icon_image}',
                  to_jsonb(COALESCE(NULLIF(benefit_item->>'icon_image', ''), im.icon_image))
                ),
                '{icon_image_alt}',
                to_jsonb(COALESCE(NULLIF(benefit_item->>'icon_image_alt', ''), im.icon_image_alt))
              )
              ORDER BY ord
            )
            FROM jsonb_array_elements(ps.published_content->'benefits') WITH ORDINALITY AS arr(benefit_item, ord)
            LEFT JOIN icon_map im ON im.id = arr.benefit_item->>'id'
          )
        )
      ELSE ps.published_content
    END AS next_published_content
  FROM page_sections ps
  WHERE ps.schema_key = 'for_creators.benefit.v1'
)
UPDATE page_sections ps
SET
  content = patched.next_content,
  published_content = patched.next_published_content
FROM patched
WHERE ps.id = patched.id;
