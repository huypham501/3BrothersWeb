-- Seed /for-brands page and local CMS sections.

DO $$
DECLARE
  for_brands_page_id UUID;
BEGIN
  INSERT INTO pages (
    slug,
    internal_name,
    status,
    seo_title,
    seo_description,
    og_image,
    og_image_alt,
    canonical_url,
    keywords,
    published_seo_title,
    published_seo_description,
    published_og_image,
    published_og_image_alt,
    published_keywords,
    has_unpublished_changes
  ) VALUES (
    'for-brands',
    'For Brands – Main',
    'published',
    'For Brands | 3BROTHERS NETWORK',
    'Kết nối thương hiệu với influencers phù hợp để tăng trưởng chiến dịch marketing.',
    '/3brothers-512x512.png',
    '3BROTHERS NETWORK',
    '{SITE_URL}/for-brands',
    ARRAY['for brands', 'influencer marketing', 'creator economy', '3brothers network'],
    'For Brands | 3BROTHERS NETWORK',
    'Kết nối thương hiệu với influencers phù hợp để tăng trưởng chiến dịch marketing.',
    '/3brothers-512x512.png',
    '3BROTHERS NETWORK',
    ARRAY['for brands', 'influencer marketing', 'creator economy', '3brothers network'],
    false
  )
  ON CONFLICT (slug) DO UPDATE SET
    internal_name = EXCLUDED.internal_name,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    og_image = EXCLUDED.og_image,
    og_image_alt = EXCLUDED.og_image_alt,
    canonical_url = EXCLUDED.canonical_url,
    keywords = EXCLUDED.keywords,
    published_seo_title = EXCLUDED.published_seo_title,
    published_seo_description = EXCLUDED.published_seo_description,
    published_og_image = EXCLUDED.published_og_image,
    published_og_image_alt = EXCLUDED.published_og_image_alt,
    published_keywords = EXCLUDED.published_keywords,
    has_unpublished_changes = false
  RETURNING id INTO for_brands_page_id;

  IF for_brands_page_id IS NULL THEN
    SELECT id INTO for_brands_page_id FROM pages WHERE slug = 'for-brands';
  END IF;

  DELETE FROM page_sections WHERE page_id = for_brands_page_id;

  INSERT INTO page_sections (
    page_id,
    schema_key,
    section_key,
    sort_order,
    enabled,
    content,
    published_content,
    published_enabled,
    has_unpublished_changes
  ) VALUES
  (
    for_brands_page_id,
    'for_brands.hero.v1',
    'for_brands.hero.v1',
    1,
    true,
    '{
      "title": "Kết Nối Thương Hiệu\nVới Influencers",
      "subtitle": "Giải pháp influencer marketing toàn diện giúp thương hiệu tiếp cận đúng khách hàng, đúng thời điểm, với đúng người ảnh hưởng.",
      "primary_cta_label": "Liên hệ tư vấn",
      "primary_cta_url": "/contact",
      "secondary_cta_label": "Xem case studies",
      "secondary_cta_url": "/social-commerce"
    }'::jsonb,
    '{
      "title": "Kết Nối Thương Hiệu\nVới Influencers",
      "subtitle": "Giải pháp influencer marketing toàn diện giúp thương hiệu tiếp cận đúng khách hàng, đúng thời điểm, với đúng người ảnh hưởng.",
      "primary_cta_label": "Liên hệ tư vấn",
      "primary_cta_url": "/contact",
      "secondary_cta_label": "Xem case studies",
      "secondary_cta_url": "/social-commerce"
    }'::jsonb,
    true,
    false
  ),
  (
    for_brands_page_id,
    'for_brands.solutions.v1',
    'for_brands.solutions.v1',
    2,
    true,
    '{
      "section_title": "Giải Pháp Influencer Marketing\nToàn Diện",
      "items": [
        "Content partnership",
        "Sponsorship",
        "Distribution",
        "Influencer marketing"
      ]
    }'::jsonb,
    '{
      "section_title": "Giải Pháp Influencer Marketing\nToàn Diện",
      "items": [
        "Content partnership",
        "Sponsorship",
        "Distribution",
        "Influencer marketing"
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    for_brands_page_id,
    'for_brands.case_studies.v1',
    'for_brands.case_studies.v1',
    3,
    true,
    '{
      "eyebrow": "Case studies",
      "section_title": "Chiến Dịch Thực Tế",
      "featured_brand": "Gillette",
      "featured_project": "Dự án ABC",
      "featured_description": "Là một trong những gương mặt gắn bó cùng 3Brothers từ những ngày đầu, Nguyệt Busi đang từng bước xây dựng dấu ấn trong cộng đồng làm đẹp thông qua những nội dung được chia sẻ từ trải nghiệm thực tế.",
      "featured_media_image": null,
      "featured_media_image_alt": null,
      "featured_stats": [
        { "value": "3.5M+", "label": "Followers" },
        { "value": "71.2M+", "label": "Likes" }
      ],
      "brand_cards": [
        { "brand": "Gillette", "metric": "70M+ Video views", "active": true, "image": null, "image_alt": null },
        { "brand": "Dior", "metric": "70M+ Video views", "active": false, "image": null, "image_alt": null },
        { "brand": "L''Oréal", "metric": "70M+ Video views", "active": false, "image": null, "image_alt": null },
        { "brand": "klairs", "metric": "70M+ Video views", "active": false, "image": null, "image_alt": null },
        { "brand": "YSL", "metric": "70M+ Video views", "active": false, "image": null, "image_alt": null }
      ]
    }'::jsonb,
    '{
      "eyebrow": "Case studies",
      "section_title": "Chiến Dịch Thực Tế",
      "featured_brand": "Gillette",
      "featured_project": "Dự án ABC",
      "featured_description": "Là một trong những gương mặt gắn bó cùng 3Brothers từ những ngày đầu, Nguyệt Busi đang từng bước xây dựng dấu ấn trong cộng đồng làm đẹp thông qua những nội dung được chia sẻ từ trải nghiệm thực tế.",
      "featured_media_image": null,
      "featured_media_image_alt": null,
      "featured_stats": [
        { "value": "3.5M+", "label": "Followers" },
        { "value": "71.2M+", "label": "Likes" }
      ],
      "brand_cards": [
        { "brand": "Gillette", "metric": "70M+ Video views", "active": true, "image": null, "image_alt": null },
        { "brand": "Dior", "metric": "70M+ Video views", "active": false, "image": null, "image_alt": null },
        { "brand": "L''Oréal", "metric": "70M+ Video views", "active": false, "image": null, "image_alt": null },
        { "brand": "klairs", "metric": "70M+ Video views", "active": false, "image": null, "image_alt": null },
        { "brand": "YSL", "metric": "70M+ Video views", "active": false, "image": null, "image_alt": null }
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    for_brands_page_id,
    'for_brands.categories.v1',
    'for_brands.categories.v1',
    4,
    true,
    '{
      "categories": ["Lifestyle", "Beauty", "Gaming", "Entertainment", "Pets", "Travel", "Sport"]
    }'::jsonb,
    '{
      "categories": ["Lifestyle", "Beauty", "Gaming", "Entertainment", "Pets", "Travel", "Sport"]
    }'::jsonb,
    true,
    false
  ),
  (
    for_brands_page_id,
    'for_brands.progress.v1',
    'for_brands.progress.v1',
    5,
    true,
    '{
      "section_title": "Chúng Tôi Làm Việc Như Thế Nào",
      "section_subtitle": "Quy trình 4 bước rõ ràng và minh bạch, từ lúc nhận brief đến khi báo cáo kết quả cuối cùng.",
      "steps": [
        {
          "title": "Tiếp Nhận Brief",
          "description": "Hiểu rõ nhu cầu, mục tiêu và ngân sách của thương hiệu."
        },
        {
          "title": "Lập Chiến Lược",
          "description": "Xây dựng chiến lược và lựa chọn influencers phù hợp nhất với thương hiệu."
        },
        {
          "title": "Triển Khai",
          "description": "Thực thi chiến dịch, sản xuất nội dung và phân phối trên các nền tảng."
        },
        {
          "title": "Báo Cáo Kết Quả",
          "description": "Đánh giá chi tiết hiệu quả, ROI và tối ưu chiến dịch liên tục."
        }
      ]
    }'::jsonb,
    '{
      "section_title": "Chúng Tôi Làm Việc Như Thế Nào",
      "section_subtitle": "Quy trình 4 bước rõ ràng và minh bạch, từ lúc nhận brief đến khi báo cáo kết quả cuối cùng.",
      "steps": [
        {
          "title": "Tiếp Nhận Brief",
          "description": "Hiểu rõ nhu cầu, mục tiêu và ngân sách của thương hiệu."
        },
        {
          "title": "Lập Chiến Lược",
          "description": "Xây dựng chiến lược và lựa chọn influencers phù hợp nhất với thương hiệu."
        },
        {
          "title": "Triển Khai",
          "description": "Thực thi chiến dịch, sản xuất nội dung và phân phối trên các nền tảng."
        },
        {
          "title": "Báo Cáo Kết Quả",
          "description": "Đánh giá chi tiết hiệu quả, ROI và tối ưu chiến dịch liên tục."
        }
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    for_brands_page_id,
    'for_brands.cta.v1',
    'for_brands.cta.v1',
    6,
    true,
    '{
      "heading": "Sẵn Sàng Nâng Tầm\nChiến Dịch Marketing?",
      "subtitle": "Liên hệ ngay để nhận tư vấn miễn phí và bắt đầu chiến dịch influencer marketing hiệu quả nhất.",
      "cta_label": "Liên hệ hợp tác",
      "cta_url": "/contact"
    }'::jsonb,
    '{
      "heading": "Sẵn Sàng Nâng Tầm\nChiến Dịch Marketing?",
      "subtitle": "Liên hệ ngay để nhận tư vấn miễn phí và bắt đầu chiến dịch influencer marketing hiệu quả nhất.",
      "cta_label": "Liên hệ hợp tác",
      "cta_url": "/contact"
    }'::jsonb,
    true,
    false
  );
END $$;
