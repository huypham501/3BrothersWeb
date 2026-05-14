-- Migration: 013_social_commerce_cms_seed.sql
-- Description: Seed /social-commerce page and local CMS sections.

DO $$
DECLARE
  social_commerce_page_id UUID;
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
    'social-commerce',
    'Social Commerce - Main',
    'published',
    'Social Commerce | 3Brothers',
    'Giải pháp gia tăng thu nhập cho Creator và KOLs. Mở ra các cơ hội monetization mới với Live Commerce, Affiliate Marketing, và mạng lưới đối tác đa dạng.',
    '/3brothers-512x512.png',
    '3BROTHERS NETWORK',
    '{SITE_URL}/social-commerce',
    ARRAY['social commerce', 'creator economy', 'affiliate marketing', 'kol marketplace'],
    'Social Commerce | 3Brothers',
    'Giải pháp gia tăng thu nhập cho Creator và KOLs. Mở ra các cơ hội monetization mới với Live Commerce, Affiliate Marketing, và mạng lưới đối tác đa dạng.',
    '/3brothers-512x512.png',
    '3BROTHERS NETWORK',
    ARRAY['social commerce', 'creator economy', 'affiliate marketing', 'kol marketplace'],
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
  RETURNING id INTO social_commerce_page_id;

  IF social_commerce_page_id IS NULL THEN
    SELECT id INTO social_commerce_page_id FROM pages WHERE slug = 'social-commerce';
  END IF;

  DELETE FROM page_sections
  WHERE page_id = social_commerce_page_id
    AND schema_key IN (
      'social_commerce.hero.v1',
      'social_commerce.growth.v1',
      'social_commerce.social_proof.v1',
      'social_commerce.value_proposition.v1'
    );

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
    social_commerce_page_id,
    'social_commerce.hero.v1',
    'social_commerce.hero.v1',
    1,
    true,
    '{
      "eyebrow": "Dịch vụ",
      "title": "Social Commerce",
      "subtitle": "Giải pháp gia tăng thu nhập cho Creator & KOLs",
      "services": [
        { "id": "live_commerce", "label": "Live Commerce" },
        { "id": "affiliate_marketing", "label": "Affiliate Marketing" },
        { "id": "kol_marketplace", "label": "KOL Marketplace" },
        { "id": "bio_link", "label": "Bio Link" },
        { "id": "brand_partnerships", "label": "Brand Partnerships" }
      ]
    }'::jsonb,
    '{
      "eyebrow": "Dịch vụ",
      "title": "Social Commerce",
      "subtitle": "Giải pháp gia tăng thu nhập cho Creator & KOLs",
      "services": [
        { "id": "live_commerce", "label": "Live Commerce" },
        { "id": "affiliate_marketing", "label": "Affiliate Marketing" },
        { "id": "kol_marketplace", "label": "KOL Marketplace" },
        { "id": "bio_link", "label": "Bio Link" },
        { "id": "brand_partnerships", "label": "Brand Partnerships" }
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    social_commerce_page_id,
    'social_commerce.growth.v1',
    'social_commerce.growth.v1',
    2,
    true,
    '{
      "heading": "NHIỀU CƠ HỘI HƠN,\nTHU NHẬP CAO HƠN",
      "description": "Nhờ vào mạng lưới Creator Economy, chúng tôi cung cấp đa dạng dịch vụ Social Commerce giúp Creator & KOL chủ động tạo ra thu nhập và mở ra các cơ hội monetization mới.",
      "cta_label": "Bắt đầu ngay",
      "cta_url": "#",
      "stats": [
        { "id": "services", "title": "5 Dịch vụ", "description": "Tạo nguồn thu nhập đa dạng hơn" },
        { "id": "creators_kols", "title": "5,000+ Creators & KOLs", "description": "Tham gia cộng tác cùng mạng lưới 3Brothers" },
        { "id": "brands", "title": "150+ Brands", "description": "Trở thành đối tác nền tảng" }
      ]
    }'::jsonb,
    '{
      "heading": "NHIỀU CƠ HỘI HƠN,\nTHU NHẬP CAO HƠN",
      "description": "Nhờ vào mạng lưới Creator Economy, chúng tôi cung cấp đa dạng dịch vụ Social Commerce giúp Creator & KOL chủ động tạo ra thu nhập và mở ra các cơ hội monetization mới.",
      "cta_label": "Bắt đầu ngay",
      "cta_url": "#",
      "stats": [
        { "id": "services", "title": "5 Dịch vụ", "description": "Tạo nguồn thu nhập đa dạng hơn" },
        { "id": "creators_kols", "title": "5,000+ Creators & KOLs", "description": "Tham gia cộng tác cùng mạng lưới 3Brothers" },
        { "id": "brands", "title": "150+ Brands", "description": "Trở thành đối tác nền tảng" }
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    social_commerce_page_id,
    'social_commerce.social_proof.v1',
    'social_commerce.social_proof.v1',
    3,
    true,
    '{
      "section_title": "5 DỊCH VỤ SOCIAL COMMERCE",
      "section_subtitle": "Giải pháp toàn diện giúp Creator & KOL tạo ra nhiều nguồn thu nhập hơn",
      "items": [
        { "id": "live_commerce", "title": "Live Commerce", "description": "Phát sóng trực tiếp kết hợp bán hàng trên các nền tảng mạng xã hội hàng đầu" },
        { "id": "affiliate_marketing", "title": "Affiliate Marketing", "description": "Tối ưu chuyển đổi và hoa hồng với hệ thống tiếp thị liên kết toàn diện" },
        { "id": "kol_marketplace", "title": "KOL Marketplace", "description": "Kết nối Creator và thương hiệu phù hợp để mở rộng chiến dịch và doanh thu" },
        { "id": "bio_link", "title": "Bio Link", "description": "Tập trung luồng truy cập và sản phẩm trên một trang cá nhân để tăng hiệu quả chuyển đổi" },
        { "id": "brand_partnerships", "title": "Brand Partnerships", "description": "Mở rộng cơ hội hợp tác với các nhãn hàng qua mạng lưới đối tác của 3Brothers" }
      ]
    }'::jsonb,
    '{
      "section_title": "5 DỊCH VỤ SOCIAL COMMERCE",
      "section_subtitle": "Giải pháp toàn diện giúp Creator & KOL tạo ra nhiều nguồn thu nhập hơn",
      "items": [
        { "id": "live_commerce", "title": "Live Commerce", "description": "Phát sóng trực tiếp kết hợp bán hàng trên các nền tảng mạng xã hội hàng đầu" },
        { "id": "affiliate_marketing", "title": "Affiliate Marketing", "description": "Tối ưu chuyển đổi và hoa hồng với hệ thống tiếp thị liên kết toàn diện" },
        { "id": "kol_marketplace", "title": "KOL Marketplace", "description": "Kết nối Creator và thương hiệu phù hợp để mở rộng chiến dịch và doanh thu" },
        { "id": "bio_link", "title": "Bio Link", "description": "Tập trung luồng truy cập và sản phẩm trên một trang cá nhân để tăng hiệu quả chuyển đổi" },
        { "id": "brand_partnerships", "title": "Brand Partnerships", "description": "Mở rộng cơ hội hợp tác với các nhãn hàng qua mạng lưới đối tác của 3Brothers" }
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    social_commerce_page_id,
    'social_commerce.value_proposition.v1',
    'social_commerce.value_proposition.v1',
    4,
    true,
    '{
      "section_title": "Giá trị tạo nên sự khác biệt",
      "section_subtitle": "Chúng tôi giúp Creator & KOL sống với đam mê bằng cách cung cấp công cụ mới để monetize từ thương hiệu cá nhân và nội dung sáng tạo",
      "items": [
        { "id": "diversification", "number": "01", "title": "Đa dạng hoá", "description": "Mở rộng sự hiện diện thương hiệu cá nhân tới đa dạng nền tảng và nhiều kênh kinh doanh khác nhau" },
        { "id": "connection", "number": "02", "title": "Kết nối", "description": "Tìm kiếm tệp người xem phù hợp, phát triển cộng đồng và chuyển đổi người theo dõi thành khách hàng trung thành" },
        { "id": "income", "number": "03", "title": "Thu nhập đa dạng", "description": "Xây dựng nguồn thu nhập bổ sung từ sáng tạo nội dung. Tìm kiếm người tiêu dùng và tạo ra doanh thu bền vững" }
      ]
    }'::jsonb,
    '{
      "section_title": "Giá trị tạo nên sự khác biệt",
      "section_subtitle": "Chúng tôi giúp Creator & KOL sống với đam mê bằng cách cung cấp công cụ mới để monetize từ thương hiệu cá nhân và nội dung sáng tạo",
      "items": [
        { "id": "diversification", "number": "01", "title": "Đa dạng hoá", "description": "Mở rộng sự hiện diện thương hiệu cá nhân tới đa dạng nền tảng và nhiều kênh kinh doanh khác nhau" },
        { "id": "connection", "number": "02", "title": "Kết nối", "description": "Tìm kiếm tệp người xem phù hợp, phát triển cộng đồng và chuyển đổi người theo dõi thành khách hàng trung thành" },
        { "id": "income", "number": "03", "title": "Thu nhập đa dạng", "description": "Xây dựng nguồn thu nhập bổ sung từ sáng tạo nội dung. Tìm kiếm người tiêu dùng và tạo ra doanh thu bền vững" }
      ]
    }'::jsonb,
    true,
    false
  );
END $$;
