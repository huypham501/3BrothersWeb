-- Seed reusable shared sections.

INSERT INTO shared_sections (
  schema_key,
  section_key,
  enabled,
  content,
  published_content,
  published_enabled,
  has_unpublished_changes
) VALUES
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
  }'::jsonb,
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
  }'::jsonb,
  true,
  false
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
  }'::jsonb,
  '{
    "title": "Đừng ngần ngại liên hệ",
    "subtitle": "3Brothers Media với sứ mệnh trở thành cầu nối tin cậy giữa các nhãn hàng và các nhà sáng tạo nội dung (KOLs). Chúng tôi tôn trọng cá tính, màu sắc riêng biệt của từng KOL.",
    "cta_label": "Liên hệ tư vấn",
    "cta_url": "#"
  }'::jsonb,
  true,
  false
)
ON CONFLICT (schema_key) DO NOTHING;
