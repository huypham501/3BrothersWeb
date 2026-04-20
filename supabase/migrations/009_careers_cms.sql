-- Migration: 009_careers_cms.sql
-- Description: Careers CMS — seed careers page + hero section, create job_positions entity table,
--              extend audit enum, seed 8 job positions from existing hardcoded data.

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Extend audit enum
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TYPE cms_audit_entity_type ADD VALUE IF NOT EXISTS 'job_position';

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. job_positions entity table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS job_positions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                        TEXT NOT NULL UNIQUE,

  -- Fast-lookup denormalized columns (mirrors top-level content fields)
  title                       TEXT NOT NULL,
  department                  TEXT,

  -- Draft content — full JobPositionContent as JSONB
  content                     JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Published snapshot — copied from content on publish
  published_content           JSONB,

  -- CMS state
  status                      cms_publish_status NOT NULL DEFAULT 'draft',
  sort_order                  INTEGER NOT NULL DEFAULT 0,
  published_at                TIMESTAMP WITH TIME ZONE,
  has_unpublished_changes     BOOLEAN NOT NULL DEFAULT false,

  -- Audit
  last_edited_by              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_edited_by_identifier   TEXT,
  last_edited_at              TIMESTAMP WITH TIME ZONE,
  last_published_by           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_published_by_identifier TEXT,
  last_published_at           TIMESTAMP WITH TIME ZONE,

  created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_positions_slug       ON job_positions(slug);
CREATE INDEX IF NOT EXISTS idx_job_positions_status     ON job_positions(status);
CREATE INDEX IF NOT EXISTS idx_job_positions_department ON job_positions(department);
CREATE INDEX IF NOT EXISTS idx_job_positions_sort_order ON job_positions(sort_order);

CREATE TRIGGER set_timestamp_job_positions
BEFORE UPDATE ON job_positions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Row Level Security — job_positions
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_positions_public_read"
  ON job_positions FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "job_positions_admin_select"
  ON job_positions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "job_positions_admin_insert"
  ON job_positions FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "job_positions_admin_update"
  ON job_positions FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "job_positions_admin_delete"
  ON job_positions FOR DELETE TO authenticated
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Seed careers page + hero section
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  careers_page_id UUID;
BEGIN
  INSERT INTO pages (
    slug, internal_name, status,
    seo_title, seo_description, og_image, og_image_alt, canonical_url, keywords,
    published_seo_title, published_seo_description, published_og_image,
    published_og_image_alt, published_keywords, has_unpublished_changes
  ) VALUES (
    'careers',
    'Careers – Main',
    'published',
    'Careers | 3BROTHERS NETWORK',
    'Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.',
    '/3brothers.png',
    '3BROTHERS NETWORK',
    '/careers',
    ARRAY['careers', 'tuyển dụng', 'influencer marketing', '3brothers network', 'việc làm'],
    'Careers | 3BROTHERS NETWORK',
    'Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.',
    '/3brothers.png',
    '3BROTHERS NETWORK',
    ARRAY['careers', 'tuyển dụng', 'influencer marketing', '3brothers network', 'việc làm'],
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
  RETURNING id INTO careers_page_id;

  IF careers_page_id IS NULL THEN
    SELECT id INTO careers_page_id FROM pages WHERE slug = 'careers';
  END IF;

  DELETE FROM page_sections WHERE page_id = careers_page_id;

  INSERT INTO page_sections (
    page_id, schema_key, section_key, sort_order, enabled,
    content, published_content, published_enabled, has_unpublished_changes
  ) VALUES (
    careers_page_id,
    'careers.hero.v1',
    'careers.hero.v1',
    1,
    true,
    '{
      "superlabel": "Gia nhập đội ngũ",
      "title": "3Brothers Media",
      "subtitle": "Chúng tôi đang tìm kiếm những tài năng đam mê sáng tạo, yêu thích thế giới Influencer Marketing và muốn tạo ra những giá trị khác biệt.",
      "perks": [
        {
          "id": "grow",
          "icon": "grow",
          "title": "Phát triển nhanh",
          "description": "Cơ hội phát triển sự nghiệp vượt bậc trong ngành Influencer Marketing đang bùng nổ."
        },
        {
          "id": "team",
          "icon": "team",
          "title": "Đội ngũ trẻ trung",
          "description": "Làm việc cùng những người trẻ tài năng, sáng tạo và đầy nhiệt huyết trong lĩnh vực media."
        },
        {
          "id": "creative",
          "icon": "creative",
          "title": "Sáng tạo không giới hạn",
          "description": "Tự do thể hiện ý tưởng, được khuyến khích đổi mới và phá vỡ khuôn mẫu truyền thống."
        }
      ]
    }'::jsonb,
    '{
      "superlabel": "Gia nhập đội ngũ",
      "title": "3Brothers Media",
      "subtitle": "Chúng tôi đang tìm kiếm những tài năng đam mê sáng tạo, yêu thích thế giới Influencer Marketing và muốn tạo ra những giá trị khác biệt.",
      "perks": [
        {
          "id": "grow",
          "icon": "grow",
          "title": "Phát triển nhanh",
          "description": "Cơ hội phát triển sự nghiệp vượt bậc trong ngành Influencer Marketing đang bùng nổ."
        },
        {
          "id": "team",
          "icon": "team",
          "title": "Đội ngũ trẻ trung",
          "description": "Làm việc cùng những người trẻ tài năng, sáng tạo và đầy nhiệt huyết trong lĩnh vực media."
        },
        {
          "id": "creative",
          "icon": "creative",
          "title": "Sáng tạo không giới hạn",
          "description": "Tự do thể hiện ý tưởng, được khuyến khích đổi mới và phá vỡ khuôn mẫu truyền thống."
        }
      ]
    }'::jsonb,
    true,
    false
  );
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Seed 8 job positions
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO job_positions (
  slug, title, department, content, published_content,
  status, sort_order, published_at, has_unpublished_changes
) VALUES

(
  'account-executive',
  'Account Executive',
  'Marketing',
  '{
    "title": "Account Executive",
    "department": "Marketing",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "1-3 năm",
    "salary": "Thoả thuận",
    "short_description": "Quản lý và phát triển mối quan hệ với các nhãn hàng đối tác chiến lược.",
    "descriptions": ["Tìm kiếm và duy trì quan hệ với khách hàng."],
    "requirements": ["Có kinh nghiệm account management."],
    "benefits": ["Lương cứng + thưởng theo dự án."]
  }'::jsonb,
  '{
    "title": "Account Executive",
    "department": "Marketing",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "1-3 năm",
    "salary": "Thoả thuận",
    "short_description": "Quản lý và phát triển mối quan hệ với các nhãn hàng đối tác chiến lược.",
    "descriptions": ["Tìm kiếm và duy trì quan hệ với khách hàng."],
    "requirements": ["Có kinh nghiệm account management."],
    "benefits": ["Lương cứng + thưởng theo dự án."]
  }'::jsonb,
  'published', 1, NOW(), false
),

(
  'content-creator',
  'Content Creator',
  'Creative',
  '{
    "title": "Content Creator",
    "department": "Creative",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "1-2 năm",
    "salary": "Thoả thuận",
    "short_description": "Sáng tạo và sản xuất nội dung hấp dẫn cho các nền tảng mạng xã hội.",
    "descriptions": ["Lên ý tưởng kịch bản video/post."],
    "requirements": ["Có tư duy sáng tạo, bắt trend tốt."],
    "benefits": ["Môi trường làm việc thoải mái, sáng tạo."]
  }'::jsonb,
  '{
    "title": "Content Creator",
    "department": "Creative",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "1-2 năm",
    "salary": "Thoả thuận",
    "short_description": "Sáng tạo và sản xuất nội dung hấp dẫn cho các nền tảng mạng xã hội.",
    "descriptions": ["Lên ý tưởng kịch bản video/post."],
    "requirements": ["Có tư duy sáng tạo, bắt trend tốt."],
    "benefits": ["Môi trường làm việc thoải mái, sáng tạo."]
  }'::jsonb,
  'published', 2, NOW(), false
),

(
  'kol-specialist',
  'KOL Specialist',
  'Marketing',
  '{
    "title": "KOL Specialist",
    "department": "Marketing",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "1-3 năm",
    "salary": "Thoả thuận",
    "short_description": "Quản lý và kết nối với mạng lưới KOLs, xây dựng chiến lược influencer.",
    "descriptions": ["Lên list KOL/KOC phù hợp chiến dịch."],
    "requirements": ["Hiểu biết về thị trường Influencers."],
    "benefits": ["Bonus campaign."]
  }'::jsonb,
  '{
    "title": "KOL Specialist",
    "department": "Marketing",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "1-3 năm",
    "salary": "Thoả thuận",
    "short_description": "Quản lý và kết nối với mạng lưới KOLs, xây dựng chiến lược influencer.",
    "descriptions": ["Lên list KOL/KOC phù hợp chiến dịch."],
    "requirements": ["Hiểu biết về thị trường Influencers."],
    "benefits": ["Bonus campaign."]
  }'::jsonb,
  'published', 3, NOW(), false
),

(
  'social-media-manager',
  'Social Media Manager',
  'Marketing',
  '{
    "title": "Social Media Manager",
    "department": "Marketing",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "3+ năm",
    "salary": "Thoả thuận",
    "short_description": "Phát triển và thực thi chiến lược truyền thông xã hội cho thương hiệu.",
    "descriptions": ["Quản lý các kênh social chính."],
    "requirements": ["Có kinh nghiệm leader."],
    "benefits": ["Đãi ngộ hấp dẫn."]
  }'::jsonb,
  '{
    "title": "Social Media Manager",
    "department": "Marketing",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "3+ năm",
    "salary": "Thoả thuận",
    "short_description": "Phát triển và thực thi chiến lược truyền thông xã hội cho thương hiệu.",
    "descriptions": ["Quản lý các kênh social chính."],
    "requirements": ["Có kinh nghiệm leader."],
    "benefits": ["Đãi ngộ hấp dẫn."]
  }'::jsonb,
  'published', 4, NOW(), false
),

(
  'video-editor',
  'Video Editor',
  'Creative',
  '{
    "title": "Video Editor",
    "department": "Creative",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "1-3 năm",
    "salary": "Thoả thuận",
    "short_description": "Biên tập và sản xuất video chất lượng cao cho các nền tảng mạng xã hội.",
    "descriptions": [
      "Xây dựng và phát triển các kênh Social của Công ty.",
      "Xây dựng kế hoạch, lên ý tưởng, thiết kế và thực hiện hệ thống video của công ty, sản phẩm...",
      "Luôn luôn cập nhật các xu hướng & đề xuất lên cho cấp trên để thực hiện sản xuất nội dung.",
      "Quản lý kho hình ảnh, video trong hệ thống của công ty."
    ],
    "requirements": [
      "Tốt nghiệp tất cả các ngành nghề liên quan",
      "Ưu tiên Nam, sinh viên mới ra trường, sẽ được đào tạo",
      "Biết sử dụng cơ bản Premiere, Photoshop, Capcut ...",
      "Có khả năng làm việc độc lập và làm việc nhóm tốt.",
      "Kỹ năng tổ chức, sắp xếp công việc và quản lý thời gian hiệu quả.",
      "Có khả năng sáng tạo, tâm huyết với công việc, chăm chỉ, ham học hỏi và tiếp thu nhanh, chịu được áp lực công việc."
    ],
    "benefits": [
      "Công việc ổn định",
      "Môi trường làm việc dân chủ, hiện đại, chuyên nghiệp, có cơ hội thăng tiến và ổn định",
      "Được tăng lương theo lộ trình làm việc.",
      "Được đào tạo nghiệp vụ chuyên sâu.",
      "Được cung cấp thiết bị, máy móc làm việc",
      "Hỗ trợ ăn trưa tại công ty.",
      "Hưởng đầy đủ các chế độ theo quy định của pháp luật: BHXH, phép năm, nghỉ lễ – Tết theo quy định, thưởng tháng 13..."
    ]
  }'::jsonb,
  '{
    "title": "Video Editor",
    "department": "Creative",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "1-3 năm",
    "salary": "Thoả thuận",
    "short_description": "Biên tập và sản xuất video chất lượng cao cho các nền tảng mạng xã hội.",
    "descriptions": [
      "Xây dựng và phát triển các kênh Social của Công ty.",
      "Xây dựng kế hoạch, lên ý tưởng, thiết kế và thực hiện hệ thống video của công ty, sản phẩm...",
      "Luôn luôn cập nhật các xu hướng & đề xuất lên cho cấp trên để thực hiện sản xuất nội dung.",
      "Quản lý kho hình ảnh, video trong hệ thống của công ty."
    ],
    "requirements": [
      "Tốt nghiệp tất cả các ngành nghề liên quan",
      "Ưu tiên Nam, sinh viên mới ra trường, sẽ được đào tạo",
      "Biết sử dụng cơ bản Premiere, Photoshop, Capcut ...",
      "Có khả năng làm việc độc lập và làm việc nhóm tốt.",
      "Kỹ năng tổ chức, sắp xếp công việc và quản lý thời gian hiệu quả.",
      "Có khả năng sáng tạo, tâm huyết với công việc, chăm chỉ, ham học hỏi và tiếp thu nhanh, chịu được áp lực công việc."
    ],
    "benefits": [
      "Công việc ổn định",
      "Môi trường làm việc dân chủ, hiện đại, chuyên nghiệp, có cơ hội thăng tiến và ổn định",
      "Được tăng lương theo lộ trình làm việc.",
      "Được đào tạo nghiệp vụ chuyên sâu.",
      "Được cung cấp thiết bị, máy móc làm việc",
      "Hỗ trợ ăn trưa tại công ty.",
      "Hưởng đầy đủ các chế độ theo quy định của pháp luật: BHXH, phép năm, nghỉ lễ – Tết theo quy định, thưởng tháng 13..."
    ]
  }'::jsonb,
  'published', 5, NOW(), false
),

(
  'campaign-manager',
  'Campaign Manager',
  'Marketing',
  '{
    "title": "Campaign Manager",
    "department": "Marketing",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "2-4 năm",
    "salary": "Thoả thuận",
    "short_description": "Lập kế hoạch và triển khai các chiến dịch marketing influencer hiệu quả.",
    "descriptions": ["Chạy chiến dịch influencer."],
    "requirements": ["Kỹ năng quản lý dự án tốt."],
    "benefits": ["Thưởng KPIs."]
  }'::jsonb,
  '{
    "title": "Campaign Manager",
    "department": "Marketing",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "2-4 năm",
    "salary": "Thoả thuận",
    "short_description": "Lập kế hoạch và triển khai các chiến dịch marketing influencer hiệu quả.",
    "descriptions": ["Chạy chiến dịch influencer."],
    "requirements": ["Kỹ năng quản lý dự án tốt."],
    "benefits": ["Thưởng KPIs."]
  }'::jsonb,
  'published', 6, NOW(), false
),

(
  'influencer-strategist',
  'Influencer Strategist',
  'Strategy',
  '{
    "title": "Influencer Strategist",
    "department": "Strategy",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "2-4 năm",
    "salary": "Thoả thuận",
    "short_description": "Xây dựng chiến lược dài hạn cho các chiến dịch influencer marketing.",
    "descriptions": ["Lên proposal chiến lược."],
    "requirements": ["Kỹ năng thuyết trình, phân tích dữ liệu."],
    "benefits": ["Lương cạnh tranh."]
  }'::jsonb,
  '{
    "title": "Influencer Strategist",
    "department": "Strategy",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "2-4 năm",
    "salary": "Thoả thuận",
    "short_description": "Xây dựng chiến lược dài hạn cho các chiến dịch influencer marketing.",
    "descriptions": ["Lên proposal chiến lược."],
    "requirements": ["Kỹ năng thuyết trình, phân tích dữ liệu."],
    "benefits": ["Lương cạnh tranh."]
  }'::jsonb,
  'published', 7, NOW(), false
),

(
  'brand-partnership',
  'Brand Partnership',
  'Business',
  '{
    "title": "Brand Partnership",
    "department": "Business",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "3+ năm",
    "salary": "Thoả thuận",
    "short_description": "Phát triển và duy trì các quan hệ đối tác với thương hiệu trong và ngoài nước.",
    "descriptions": ["Đàm phán với nhãn hàng lớn."],
    "requirements": ["Mối quan hệ tốt với brands."],
    "benefits": ["Hoa hồng cao."]
  }'::jsonb,
  '{
    "title": "Brand Partnership",
    "department": "Business",
    "type": "Full-time",
    "location": "Hồ Chí Minh",
    "experience": "3+ năm",
    "salary": "Thoả thuận",
    "short_description": "Phát triển và duy trì các quan hệ đối tác với thương hiệu trong và ngoài nước.",
    "descriptions": ["Đàm phán với nhãn hàng lớn."],
    "requirements": ["Mối quan hệ tốt với brands."],
    "benefits": ["Hoa hồng cao."]
  }'::jsonb,
  'published', 8, NOW(), false
)

ON CONFLICT (slug) DO NOTHING;
