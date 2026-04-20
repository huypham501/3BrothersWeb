-- Seed global header/footer settings.

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
  'global.header.v1',
  'global.header.v1',
  true,
  '{
    "logo_text": "3BROTHERS",
    "logo_image": null,
    "nav_links": [
      {"label": "For Creators", "url": "/for-creators"},
      {"label": "Our Brands", "url": "/our-brand"},
      {"label": "Blogs", "url": "/blogs"},
      {"label": "Careers", "url": "/careers"}
    ],
    "cta_label": "Liên hệ ngay",
    "cta_url": "#"
  }'::jsonb,
  '{
    "logo_text": "3BROTHERS",
    "logo_image": null,
    "nav_links": [
      {"label": "For Creators", "url": "/for-creators"},
      {"label": "Our Brands", "url": "/our-brand"},
      {"label": "Blogs", "url": "/blogs"},
      {"label": "Careers", "url": "/careers"}
    ],
    "cta_label": "Liên hệ ngay",
    "cta_url": "#"
  }'::jsonb,
  true,
  false
),
(
  'global.footer.v1',
  'global.footer.v1',
  true,
  '{
    "thank_you_heading": "CẢM ƠN SỰ TIN TƯỞNG CỦA QUÍ ĐỐI TÁC",
    "email": "work.3brothers@gmail.com",
    "address": "123 Phan Văn Giang, Phú Nhuận, Hồ Chí Minh",
    "menu_links": [
      {"label": "For Creators", "url": "/for-creators"},
      {"label": "About Us", "url": "#"},
      {"label": "Careers", "url": "/careers"},
      {"label": "Blogs", "url": "/blogs"}
    ],
    "social_links": [
      {"label": "Facebook", "url": "#"},
      {"label": "Instagram", "url": "#"},
      {"label": "Tiktok", "url": "#"},
      {"label": "Thread", "url": "#"}
    ],
    "brand_watermark": "3BROTHERS.MEDIA"
  }'::jsonb,
  '{
    "thank_you_heading": "CẢM ƠN SỰ TIN TƯỞNG CỦA QUÍ ĐỐI TÁC",
    "email": "work.3brothers@gmail.com",
    "address": "123 Phan Văn Giang, Phú Nhuận, Hồ Chí Minh",
    "menu_links": [
      {"label": "For Creators", "url": "/for-creators"},
      {"label": "About Us", "url": "#"},
      {"label": "Careers", "url": "/careers"},
      {"label": "Blogs", "url": "/blogs"}
    ],
    "social_links": [
      {"label": "Facebook", "url": "#"},
      {"label": "Instagram", "url": "#"},
      {"label": "Tiktok", "url": "#"},
      {"label": "Thread", "url": "#"}
    ],
    "brand_watermark": "3BROTHERS.MEDIA"
  }'::jsonb,
  true,
  false
)
ON CONFLICT (schema_key) DO NOTHING;
