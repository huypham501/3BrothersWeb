-- Seed SEO defaults and site metadata.

INSERT INTO global_settings (
  schema_key,
  setting_key,
  enabled,
  content,
  published_content,
  published_enabled,
  has_unpublished_changes
) VALUES
(
  'global.seo_defaults.v1',
  'global.seo_defaults.v1',
  true,
  '{
    "default_title_template": "{{page_title}} | {{brand_name}}",
    "default_meta_description": "3BROTHERS NETWORK - Creator economy platform.",
    "default_keywords": ["3brothers network", "creator economy", "influencer marketing"],
    "default_og_image": "/3brothers.png",
    "default_og_image_alt": "3BROTHERS NETWORK",
    "default_twitter_card_type": "summary_large_image",
    "default_robots": "index,follow"
  }'::jsonb,
  '{
    "default_title_template": "{{page_title}} | {{brand_name}}",
    "default_meta_description": "3BROTHERS NETWORK - Creator economy platform.",
    "default_keywords": ["3brothers network", "creator economy", "influencer marketing"],
    "default_og_image": "/3brothers.png",
    "default_og_image_alt": "3BROTHERS NETWORK",
    "default_twitter_card_type": "summary_large_image",
    "default_robots": "index,follow"
  }'::jsonb,
  true,
  false
),
(
  'global.site_metadata.v1',
  'global.site_metadata.v1',
  true,
  '{
    "site_name": "3BROTHERS NETWORK",
    "site_url": "https://3brothers.media",
    "default_canonical_base": "https://3brothers.media",
    "brand_name": "3BROTHERS",
    "publisher_name": "3BROTHERS NETWORK"
  }'::jsonb,
  '{
    "site_name": "3BROTHERS NETWORK",
    "site_url": "https://3brothers.media",
    "default_canonical_base": "https://3brothers.media",
    "brand_name": "3BROTHERS",
    "publisher_name": "3BROTHERS NETWORK"
  }'::jsonb,
  true,
  false
)
ON CONFLICT (schema_key) DO UPDATE SET
  content = EXCLUDED.content,
  published_content = EXCLUDED.published_content,
  published_enabled = EXCLUDED.published_enabled,
  has_unpublished_changes = false;
