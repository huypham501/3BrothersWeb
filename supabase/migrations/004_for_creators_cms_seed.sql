-- Migration: 004_for_creators_cms_seed.sql
-- Description: Seed /for-creators page and local CMS sections.

DO $$
DECLARE
  for_creators_page_id UUID;
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
    'for-creators',
    'For Creators – Main',
    'published',
    'For Creators | 3BROTHERS NETWORK',
    'Grow your community. Maximize your opportunity.',
    '/3brothers.png',
    '3BROTHERS NETWORK',
    '{SITE_URL}/for-creators',
    ARRAY['creator', 'creators', 'creator program', '3brothers network'],
    'For Creators | 3BROTHERS NETWORK',
    'Grow your community. Maximize your opportunity.',
    '/3brothers.png',
    '3BROTHERS NETWORK',
    ARRAY['creator', 'creators', 'creator program', '3brothers network'],
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
  RETURNING id INTO for_creators_page_id;

  IF for_creators_page_id IS NULL THEN
    SELECT id INTO for_creators_page_id FROM pages WHERE slug = 'for-creators';
  END IF;

  DELETE FROM page_sections WHERE page_id = for_creators_page_id;

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
    for_creators_page_id,
    'for_creators.hero.v1',
    'for_creators.hero.v1',
    1,
    true,
    '{
      "title": "Tỏa Sáng Cùng\n3Brothers.Media",
      "subtitle": "Chúng tôi giúp bạn phát triển thương hiệu cá nhân, kết nối với các nhãn hàng hàng đầu và tối ưu hóa thu nhập từ nội dung sáng tạo.",
      "primary_cta_label": "Gia nhập ngay",
      "primary_cta_url": "/contact",
      "secondary_cta_label": "Tìm hiểu thêm",
      "secondary_cta_url": "#benefit"
    }'::jsonb,
    '{
      "title": "Tỏa Sáng Cùng\n3Brothers.Media",
      "subtitle": "Chúng tôi giúp bạn phát triển thương hiệu cá nhân, kết nối với các nhãn hàng hàng đầu và tối ưu hóa thu nhập từ nội dung sáng tạo.",
      "primary_cta_label": "Gia nhập ngay",
      "primary_cta_url": "/contact",
      "secondary_cta_label": "Tìm hiểu thêm",
      "secondary_cta_url": "#benefit"
    }'::jsonb,
    true,
    false
  ),
  (
    for_creators_page_id,
    'for_creators.benefit.v1',
    'for_creators.benefit.v1',
    2,
    true,
    '{
      "section_title": "Lợi ích khi cùng đồng hành",
      "section_description": "Chúng tôi cung cấp giải pháp Influencer Marketing & Talent Management chuyên nghiệp, giúp thương hiệu triển khai hiệu quả và xây dựng giá trị dài hạn.",
      "contact_cta_label": "Liên hệ hỗ trợ",
      "contact_cta_url": "/contact",
      "benefits": [
        {
          "id": "income",
          "title": "Tăng trưởng thu nhập",
          "description": "Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến"
        },
        {
          "id": "brand",
          "title": "Kết nối nhãn hàng",
          "description": "Tiếp cận với hàng trăm thương hiệu hàng đầu Việt Nam và quốc tế đang tìm kiếm KOLs phù hợp"
        },
        {
          "id": "management",
          "title": "Quản lý chuyên nghiệp",
          "description": "Đội ngũ quản lý tận tâm, hỗ trợ bạn từ hợp đồng, lịch trình đến chiến lược phát triển dài hạn"
        },
        {
          "id": "content",
          "title": "Hỗ trợ nội dung",
          "description": "Studio chuyên nghiệp, đội ngũ sản xuất sáng tạo giúp nâng tầm chất lượng video và hình ảnh"
        }
      ]
    }'::jsonb,
    '{
      "section_title": "Lợi ích khi cùng đồng hành",
      "section_description": "Chúng tôi cung cấp giải pháp Influencer Marketing & Talent Management chuyên nghiệp, giúp thương hiệu triển khai hiệu quả và xây dựng giá trị dài hạn.",
      "contact_cta_label": "Liên hệ hỗ trợ",
      "contact_cta_url": "/contact",
      "benefits": [
        {
          "id": "income",
          "title": "Tăng trưởng thu nhập",
          "description": "Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến"
        },
        {
          "id": "brand",
          "title": "Kết nối nhãn hàng",
          "description": "Tiếp cận với hàng trăm thương hiệu hàng đầu Việt Nam và quốc tế đang tìm kiếm KOLs phù hợp"
        },
        {
          "id": "management",
          "title": "Quản lý chuyên nghiệp",
          "description": "Đội ngũ quản lý tận tâm, hỗ trợ bạn từ hợp đồng, lịch trình đến chiến lược phát triển dài hạn"
        },
        {
          "id": "content",
          "title": "Hỗ trợ nội dung",
          "description": "Studio chuyên nghiệp, đội ngũ sản xuất sáng tạo giúp nâng tầm chất lượng video và hình ảnh"
        }
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    for_creators_page_id,
    'for_creators.testimonials.v1',
    'for_creators.testimonials.v1',
    3,
    true,
    '{
      "superlabel": "Creator nói gì về chúng tôi",
      "section_title": "Câu Chuyện Thành Công",
      "testimonials": [
        {
          "quote": "\"Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến\"",
          "name": "Minh Anh",
          "role": "Beauty creator - 500K follows"
        },
        {
          "quote": "\"Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến\"",
          "name": "Minh Anh",
          "role": "Beauty creator - 500K follows"
        },
        {
          "quote": "\"Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến\"",
          "name": "Minh Anh",
          "role": "Beauty creator - 500K follows"
        }
      ]
    }'::jsonb,
    '{
      "superlabel": "Creator nói gì về chúng tôi",
      "section_title": "Câu Chuyện Thành Công",
      "testimonials": [
        {
          "quote": "\"Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến\"",
          "name": "Minh Anh",
          "role": "Beauty creator - 500K follows"
        },
        {
          "quote": "\"Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến\"",
          "name": "Minh Anh",
          "role": "Beauty creator - 500K follows"
        },
        {
          "quote": "\"Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến\"",
          "name": "Minh Anh",
          "role": "Beauty creator - 500K follows"
        }
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    for_creators_page_id,
    'for_creators.cta.v1',
    'for_creators.cta.v1',
    4,
    true,
    '{
      "heading": "Sẵn Sàng Bắt Đầu\nHành Trình Cùng Chúng Tôi?",
      "subtitle": "Đăng ký ngay hôm nay để trở thành một phần của cộng đồng creator hàng đầu Việt Nam.",
      "cta_label": "Gia nhập 3Brothers",
      "cta_url": "/contact"
    }'::jsonb,
    '{
      "heading": "Sẵn Sàng Bắt Đầu\nHành Trình Cùng Chúng Tôi?",
      "subtitle": "Đăng ký ngay hôm nay để trở thành một phần của cộng đồng creator hàng đầu Việt Nam.",
      "cta_label": "Gia nhập 3Brothers",
      "cta_url": "/contact"
    }'::jsonb,
    true,
    false
  );
END $$;
