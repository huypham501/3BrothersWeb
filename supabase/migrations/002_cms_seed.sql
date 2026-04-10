-- Migration: 002_cms_seed.sql
-- Description: Seed data for the Home CMS based on home_cms_spec.md.

-- 1. Seed Global Settings
INSERT INTO global_settings (schema_key, setting_key, enabled, content) VALUES
(
    'global.header.v1',
    'global.header.v1',
    true,
    '{
        "logo_text": "3BROTHERS",
        "logo_image": null,
        "nav_links": [
            {"label": "For Creators", "url": "/for-creators"},
            {"label": "For Brands", "url": "/for-brands"},
            {"label": "Our Brands", "url": "/our-brand"},
            {"label": "Blogs", "url": "/blogs"},
            {"label": "Careers", "url": "/careers"}
        ],
        "cta_label": "Liên hệ ngay",
        "cta_url": "#"
    }'::jsonb
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
            {"label": "For Brands", "url": "/for-brands"},
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
    }'::jsonb
)
ON CONFLICT (schema_key) DO NOTHING;

-- 2. Seed Shared Sections
INSERT INTO shared_sections (schema_key, section_key, enabled, content) VALUES
(
    'shared.exclusive_talents.v1',
    'shared.exclusive_talents.v1',
    true,
    '{
        "section_title": "TALENTS độc quyền",
        "featured_name": "Nguyệt Busi",
        "featured_handle": "@nguyetbusine",
        "featured_photo": null,
        "featured_photo_alt": "Nguyệt Busi",
        "featured_description": "Là một trong những gương mặt gắn bó cùng 3Brothers từ những ngày đầu, Nguyệt Busi đang từng bước xây dựng dấu ấn trong cộng đồng làm đẹp thông qua những nội dung được chia sẻ từ trải nghiệm thực tế. Không chỉ dừng lại ở các chuyên mục về skincare hay trang điểm, \"Thánh mặt nạ dẻo\" Nguyệt Busi còn ghi dấu ấn bằng các series đắp mặt nạ siêu vui nhộn, thu hút hàng triệu lượt xem mỗi tập. Cô nàng hiện đang là một trong những beauty creator được yêu thích nhất trên nền tảng TikTok và Instagram tại Việt Nam.",
        "featured_stats": [
            {"value": "3.5M+", "label": "Followers"},
            {"value": "71.2M+", "label": "Likes"}
        ],
        "talent_count_label": "50+ TALENTS",
        "talents": [
            {"name": "PUPU HOEHOE", "photo": null, "photo_alt": null},
            {"name": "Phương Kin", "photo": null, "photo_alt": null},
            {"name": "Phúc Nhân", "photo": null, "photo_alt": null},
            {"name": "Kiều Lan", "photo": null, "photo_alt": null},
            {"name": "Phương ...", "photo": null, "photo_alt": null},
            {"name": "Nguyệt Busi", "photo": null, "photo_alt": null},
            {"name": "Hồng Anh", "photo": null, "photo_alt": null}
        ]
    }'::jsonb
),
(
    'shared.contact_cta.v1',
    'shared.contact_cta.v1',
    true,
    '{
        "title": "Đừng ngần ngại liên hệ",
        "subtitle": "3Brothers Media với sứ mệnh trở thành cầu nối tin cậy giữa các nhãn hàng và các nhà sáng tạo nội dung (KOLs). Chúng tôi tôn trọng cá tính, màu sắc riêng biệt của từng KOL.",
        "cta_label": "Liên hệ tư vấn",
        "cta_url": "#"
    }'::jsonb
)
ON CONFLICT (schema_key) DO NOTHING;

-- 3. Seed Page
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
        keywords
    ) VALUES (
        'home',
        'Home – Main',
        'published',
        '3BROTHERS NETWORK | The Leading Creator Economy Platform',
        'Make your passion your paycheck',
        '/3brothers.png',
        '3BROTHERS NETWORK',
        '{SITE_URL}',
        ARRAY['youtube','creators','creator economy','3brothers network']
    )
    ON CONFLICT (slug) DO UPDATE SET internal_name = EXCLUDED.internal_name
    RETURNING id INTO new_page_id;

    -- If the page already existed and returning id failed (because data matched perfectly), fetch it
    IF new_page_id IS NULL THEN
        SELECT id INTO new_page_id FROM pages WHERE slug = 'home';
    END IF;

    -- Clear existing page sections for home
    DELETE FROM page_sections WHERE page_id = new_page_id;

    -- 4. Seed Page Sections
    INSERT INTO page_sections (page_id, schema_key, section_key, sort_order, enabled, content) VALUES
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
        }'::jsonb
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
        }'::jsonb
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
        }'::jsonb
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
        }'::jsonb
    ),
    (
        new_page_id,
        'shared.exclusive_talents.v1',
        'shared.exclusive_talents.v1',
        5,
        true,
        '{}'::jsonb -- Content is derived from shared_sections
    ),
    (
        new_page_id,
        'shared.contact_cta.v1',
        'shared.contact_cta.v1',
        6,
        true,
        '{}'::jsonb -- Content is derived from shared_sections
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
        }'::jsonb
    );
END $$;
