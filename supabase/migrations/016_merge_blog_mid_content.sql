-- Migration: 016_merge_blog_mid_content.sql
-- Description: Merge legacy blog mid_content and split embedded section images into image blocks.

BEGIN;

CREATE OR REPLACE FUNCTION pg_temp.normalize_blog_sections(sections jsonb)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  WITH source AS (
    SELECT
      elem,
      ordinality
    FROM jsonb_array_elements(COALESCE(sections, '[]'::jsonb)) WITH ORDINALITY AS item(elem, ordinality)
  ),
  normalized AS (
    SELECT
      ordinality,
      1 AS block_order,
      jsonb_build_object(
        'type', 'image',
        'id', elem->>'id',
        'heading', NULL,
        'body', NULL,
        'image_url', elem->>'image_url',
        'image_alt', elem->>'image_alt',
        'image_caption', elem->>'image_caption'
      ) AS block
    FROM source
    WHERE elem->>'type' = 'image'

    UNION ALL

    SELECT
      ordinality,
      CASE WHEN elem->>'image_position' = 'before_body' AND elem ? 'image_url' AND NULLIF(elem->>'image_url', '') IS NOT NULL THEN 2 ELSE 1 END AS block_order,
      jsonb_build_object(
        'type', 'text',
        'id', elem->>'id',
        'heading', elem->'heading',
        'body', COALESCE(elem->>'body', '')
      ) AS block
    FROM source
    WHERE COALESCE(elem->>'type', 'text') <> 'image'

    UNION ALL

    SELECT
      ordinality,
      CASE WHEN elem->>'image_position' = 'before_body' THEN 1 ELSE 2 END AS block_order,
      jsonb_build_object(
        'type', 'image',
        'id', concat(elem->>'id', '-image'),
        'heading', NULL,
        'body', NULL,
        'image_url', elem->>'image_url',
        'image_alt', elem->>'image_alt',
        'image_caption', elem->>'image_caption'
      ) AS block
    FROM source
    WHERE COALESCE(elem->>'type', 'text') <> 'image'
      AND elem ? 'image_url'
      AND NULLIF(elem->>'image_url', '') IS NOT NULL
  )
  SELECT COALESCE(jsonb_agg(block ORDER BY ordinality, block_order), '[]'::jsonb)
  FROM normalized;
$$;

-- Keep existing draft content order, append legacy mid_content, then split embedded images.
UPDATE blog_posts
SET
  content = pg_temp.normalize_blog_sections(COALESCE(content, '[]'::jsonb) || COALESCE(mid_content, '[]'::jsonb)),
  mid_content = '[]'::jsonb,
  updated_at = NOW()
WHERE jsonb_array_length(COALESCE(content, '[]'::jsonb)) > 0
   OR jsonb_array_length(COALESCE(mid_content, '[]'::jsonb)) > 0;

-- Keep existing published content order, append legacy published_mid_content, then split embedded images.
UPDATE blog_posts
SET
  published_content = pg_temp.normalize_blog_sections(COALESCE(published_content, '[]'::jsonb) || COALESCE(published_mid_content, '[]'::jsonb)),
  published_mid_content = '[]'::jsonb,
  updated_at = NOW()
WHERE jsonb_array_length(COALESCE(published_content, '[]'::jsonb)) > 0
   OR jsonb_array_length(COALESCE(published_mid_content, '[]'::jsonb)) > 0;

COMMIT;
