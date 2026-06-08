-- Seed Blog Detail social share global setting.

INSERT INTO global_settings (
  schema_key,
  setting_key,
  enabled,
  content,
  published_content,
  published_enabled,
  has_unpublished_changes
) VALUES (
  'global.blog_social_share.v1',
  'global.blog_social_share.v1',
  true,
  '{
    "enabled": true,
    "platforms": [
      {
        "id": "facebook",
        "label": "Facebook",
        "enabled": true,
        "url_template": "https://www.facebook.com/sharer/sharer.php?u={url}"
      },
      {
        "id": "x",
        "label": "X",
        "enabled": true,
        "url_template": "https://twitter.com/intent/tweet?url={url}&text={title}"
      },
      {
        "id": "instagram",
        "label": "Instagram",
        "enabled": true,
        "url_template": "#"
      },
      {
        "id": "youtube",
        "label": "YouTube",
        "enabled": true,
        "url_template": "#"
      }
    ]
  }'::jsonb,
  '{
    "enabled": true,
    "platforms": [
      {
        "id": "facebook",
        "label": "Facebook",
        "enabled": true,
        "url_template": "https://www.facebook.com/sharer/sharer.php?u={url}"
      },
      {
        "id": "x",
        "label": "X",
        "enabled": true,
        "url_template": "https://twitter.com/intent/tweet?url={url}&text={title}"
      },
      {
        "id": "instagram",
        "label": "Instagram",
        "enabled": true,
        "url_template": "#"
      },
      {
        "id": "youtube",
        "label": "YouTube",
        "enabled": true,
        "url_template": "#"
      }
    ]
  }'::jsonb,
  true,
  false
)
ON CONFLICT (schema_key) DO NOTHING;
