-- Seed home page and its ordered page sections.

DO $$
DECLARE
  new_page_id UUID;
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
    'home',
    'Home – Main',
    'published',
    '3BROTHERS NETWORK | The Leading Creator Economy Platform',
    'Make your passion your paycheck',
    '/3brothers.png',
    '3BROTHERS NETWORK',
    '{SITE_URL}',
    ARRAY['youtube','creators','creator economy','3brothers network'],
    '3BROTHERS NETWORK | The Leading Creator Economy Platform',
    'Make your passion your paycheck',
    '/3brothers.png',
    '3BROTHERS NETWORK',
    ARRAY['youtube','creators','creator economy','3brothers network'],
    false
  )
  ON CONFLICT (slug) DO UPDATE
  SET internal_name = EXCLUDED.internal_name
  RETURNING id INTO new_page_id;

  IF new_page_id IS NULL THEN
    SELECT id INTO new_page_id FROM pages WHERE slug = 'home';
  END IF;

  DELETE FROM page_sections WHERE page_id = new_page_id;

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
    new_page_id,
    'home.hero.v1',
    'home.hero.v1',
    1,
    true,
    '{
      "title": "Đồng hành để\ncùng thành\ncông",
      "subtext": "3Brothers Media cung cấp giải pháp phù hợp và hiệu quả cho nhãn hàng dựa trên sự thấu hiểu - tôn trọng màu sắc Talent.",
      "primary_cta_label": "Liên hệ tư vấn",
      "primary_cta_url": "#",
      "secondary_cta_label": "Xem portfolio",
      "secondary_cta_url": "#",
      "media_image": null,
      "media_image_alt": null
    }'::jsonb,
    '{
      "title": "Đồng hành để\ncùng thành\ncông",
      "subtext": "3Brothers Media cung cấp giải pháp phù hợp và hiệu quả cho nhãn hàng dựa trên sự thấu hiểu - tôn trọng màu sắc Talent.",
      "primary_cta_label": "Liên hệ tư vấn",
      "primary_cta_url": "#",
      "secondary_cta_label": "Xem portfolio",
      "secondary_cta_url": "#",
      "media_image": null,
      "media_image_alt": null
    }'::jsonb,
    true,
    false
  ),
  (
    new_page_id,
    'home.partners.v1',
    'home.partners.v1',
    2,
    true,
    '{
      "section_label": "",
      "partners": [
        {"name": "Gillette", "logo_image": null, "url": "#"},
        {"name": "Dior", "logo_image": null, "url": "#"},
        {"name": "L''Oreal", "logo_image": null, "url": "#"},
        {"name": "Klairs", "logo_image": null, "url": "#"},
        {"name": "YSL", "logo_image": null, "url": "#"},
        {"name": "MONO TALK", "logo_image": null, "url": "#"},
        {"name": "Grab", "logo_image": null, "url": "#"},
        {"name": "closeup", "logo_image": null, "url": "#"}
      ]
    }'::jsonb,
    '{
      "section_label": "",
      "partners": [
        {"name": "Gillette", "logo_image": null, "url": "#"},
        {"name": "Dior", "logo_image": null, "url": "#"},
        {"name": "L''Oreal", "logo_image": null, "url": "#"},
        {"name": "Klairs", "logo_image": null, "url": "#"},
        {"name": "YSL", "logo_image": null, "url": "#"},
        {"name": "MONO TALK", "logo_image": null, "url": "#"},
        {"name": "Grab", "logo_image": null, "url": "#"},
        {"name": "closeup", "logo_image": null, "url": "#"}
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    new_page_id,
    'home.core_competencies.v1',
    'home.core_competencies.v1',
    3,
    true,
    '{
      "section_title": "Năng lực cốt lõi",
      "services": [
        {
          "title": "Influencer Management",
          "description": "3Brothers Media cung cấp nền tảng quản lý Influencer chuyên nghiệp với quy trình chọn lọc, đào tạo phát triển và tối ưu hình ảnh cá nhân cho từng talent.",
          "image": null,
          "link_url": "#"
        },
        {
          "title": "Campaign Strategy",
          "description": "Tư vấn chiến lược triển khai campaign hiệu quả, đánh trúng insight khách hàng với phương pháp kết hợp sức mạnh mạng lưới Influencer rộng lớn.",
          "image": null,
          "link_url": "#"
        },
        {
          "title": "Content production",
          "description": "Đội ngũ sản xuất nội dung giàu kinh nghiệm đảm bảo chất lượng hình ảnh, video với phong cách trending, thu hút tương tác tự nhiên cao nhất.",
          "image": null,
          "link_url": "#"
        },
        {
          "title": "Event planning",
          "description": "Tổ chức các sự kiện quảng bá truyền thông chuyên nghiệp trong và ngoài nước, kết nối mạng lưới nhãn hàng cùng các content creators.",
          "image": null,
          "link_url": "#"
        }
      ]
    }'::jsonb,
    '{
      "section_title": "Năng lực cốt lõi",
      "services": [
        {
          "title": "Influencer Management",
          "description": "3Brothers Media cung cấp nền tảng quản lý Influencer chuyên nghiệp với quy trình chọn lọc, đào tạo phát triển và tối ưu hình ảnh cá nhân cho từng talent.",
          "image": null,
          "link_url": "#"
        },
        {
          "title": "Campaign Strategy",
          "description": "Tư vấn chiến lược triển khai campaign hiệu quả, đánh trúng insight khách hàng với phương pháp kết hợp sức mạnh mạng lưới Influencer rộng lớn.",
          "image": null,
          "link_url": "#"
        },
        {
          "title": "Content production",
          "description": "Đội ngũ sản xuất nội dung giàu kinh nghiệm đảm bảo chất lượng hình ảnh, video với phong cách trending, thu hút tương tác tự nhiên cao nhất.",
          "image": null,
          "link_url": "#"
        },
        {
          "title": "Event planning",
          "description": "Tổ chức các sự kiện quảng bá truyền thông chuyên nghiệp trong và ngoài nước, kết nối mạng lưới nhãn hàng cùng các content creators.",
          "image": null,
          "link_url": "#"
        }
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    new_page_id,
    'home.efficiency.v1',
    'home.efficiency.v1',
    4,
    true,
    '{
      "section_title": "Hiệu quả thực thi",
      "description": "Chúng tôi cung cấp giải pháp Influencer Marketing & Talent Management chuyên nghiệp, giúp thương hiệu triển khai hiệu quả và xây dựng giá trị dài hạn.",
      "primary_cta_label": "Liên hệ tư vấn",
      "primary_cta_url": "#",
      "secondary_cta_label": "Xem portfolio",
      "secondary_cta_url": "#",
      "stats": [
        {"title": "Lượt tiếp cận", "description": "Đa nền tảng, tiếp cận đa dạng tệp khách hàng", "number": "30M+"},
        {"title": "Video được sản xuất", "description": "Năng lực sản xuất, đảm bảo tiến độ", "number": "30M+"},
        {"title": "Lượt tiếp cận", "description": "Lượt tiếp cận", "number": "30M+"},
        {"title": "Lượt tiếp cận", "description": "Lượt tiếp cận", "number": "30M+"}
      ]
    }'::jsonb,
    '{
      "section_title": "Hiệu quả thực thi",
      "description": "Chúng tôi cung cấp giải pháp Influencer Marketing & Talent Management chuyên nghiệp, giúp thương hiệu triển khai hiệu quả và xây dựng giá trị dài hạn.",
      "primary_cta_label": "Liên hệ tư vấn",
      "primary_cta_url": "#",
      "secondary_cta_label": "Xem portfolio",
      "secondary_cta_url": "#",
      "stats": [
        {"title": "Lượt tiếp cận", "description": "Đa nền tảng, tiếp cận đa dạng tệp khách hàng", "number": "30M+"},
        {"title": "Video được sản xuất", "description": "Năng lực sản xuất, đảm bảo tiến độ", "number": "30M+"},
        {"title": "Lượt tiếp cận", "description": "Lượt tiếp cận", "number": "30M+"},
        {"title": "Lượt tiếp cận", "description": "Lượt tiếp cận", "number": "30M+"}
      ]
    }'::jsonb,
    true,
    false
  ),
  (
    new_page_id,
    'shared.exclusive_talents.v1',
    'shared.exclusive_talents.v1',
    5,
    true,
    '{}'::jsonb,
    '{}'::jsonb,
    true,
    false
  ),
  (
    new_page_id,
    'shared.contact_cta.v1',
    'shared.contact_cta.v1',
    6,
    true,
    '{}'::jsonb,
    '{}'::jsonb,
    true,
    false
  ),
  (
    new_page_id,
    'home.trending.v1',
    'home.trending.v1',
    7,
    true,
    '{
      "section_title": "Xu hướng có gì?",
      "view_all_label": "Xem tất cả",
      "view_all_url": "/blogs",
      "news_source": "manual",
      "news_limit": 3,
      "news_items": [
        {
          "title": "2025 - Một năm tăng tốc Media trong hệ sinh thái Influence",
          "date": "12 JAN 2026",
          "image": null,
          "image_alt": null,
          "url": "#"
        },
        {
          "title": "Đồng hành cùng chương trình ''Xuân Về Bản Em 2026''",
          "date": "12 JAN 2026",
          "image": null,
          "image_alt": null,
          "url": "#"
        },
        {
          "title": "3BROTHERS MEDIA x WECHOICE AWARDS 2025",
          "date": "12 JAN 2026",
          "image": null,
          "image_alt": null,
          "url": "#"
        }
      ]
    }'::jsonb,
    '{
      "section_title": "Xu hướng có gì?",
      "view_all_label": "Xem tất cả",
      "view_all_url": "/blogs",
      "news_source": "manual",
      "news_limit": 3,
      "news_items": [
        {
          "title": "2025 - Một năm tăng tốc Media trong hệ sinh thái Influence",
          "date": "12 JAN 2026",
          "image": null,
          "image_alt": null,
          "url": "#"
        },
        {
          "title": "Đồng hành cùng chương trình ''Xuân Về Bản Em 2026''",
          "date": "12 JAN 2026",
          "image": null,
          "image_alt": null,
          "url": "#"
        },
        {
          "title": "3BROTHERS MEDIA x WECHOICE AWARDS 2025",
          "date": "12 JAN 2026",
          "image": null,
          "image_alt": null,
          "url": "#"
        }
      ]
    }'::jsonb,
    true,
    false
  );
END $$;
