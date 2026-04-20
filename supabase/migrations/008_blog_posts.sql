-- Migration: 008_blog_posts.sql
-- Description: Create blog_posts table with draft/publish flow, RLS, audit columns, and seed data.

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Extend existing audit enum for blog_post entity type
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TYPE cms_audit_entity_type ADD VALUE IF NOT EXISTS 'blog_post';

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. blog_posts table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_posts (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                        TEXT NOT NULL UNIQUE,
  title                       TEXT NOT NULL,
  badge                       TEXT,
  excerpt                     TEXT,
  cover_image_bg              TEXT,         -- CSS gradient fallback when no real image
  cover_image_url             TEXT,
  cover_image_alt             TEXT,

  -- Article body: array of { id, heading, body } objects
  content                     JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Optional mid-page sections (rendered after hero image break)
  mid_content                 JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- SEO
  seo_title                   TEXT,
  seo_description             TEXT,
  og_image                    TEXT,
  keywords                    TEXT[] DEFAULT '{}',

  -- CMS state
  status                      cms_publish_status NOT NULL DEFAULT 'draft',
  is_featured                 BOOLEAN NOT NULL DEFAULT false,
  sort_order                  INTEGER NOT NULL DEFAULT 0,
  published_at                TIMESTAMP WITH TIME ZONE,

  -- Draft/Publish parallel columns
  published_title             TEXT,
  published_badge             TEXT,
  published_excerpt           TEXT,
  published_cover_image_bg    TEXT,
  published_cover_image_url   TEXT,
  published_cover_image_alt   TEXT,
  published_content           JSONB,
  published_mid_content       JSONB,
  published_seo_title         TEXT,
  published_seo_description   TEXT,
  published_og_image          TEXT,
  published_keywords          TEXT[],
  published_is_featured       BOOLEAN,
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug        ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status      ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_sort_order  ON blog_posts(sort_order);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC NULLS LAST);

-- Auto-update updated_at
CREATE TRIGGER set_timestamp_blog_posts
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anonymous / public: can only read published posts
CREATE POLICY "blog_posts_public_read"
  ON blog_posts
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated admin: full access
CREATE POLICY "blog_posts_admin_select"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "blog_posts_admin_insert"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "blog_posts_admin_update"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "blog_posts_admin_delete"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Seed data — 3 posts based on existing hardcoded placeholder content
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO blog_posts (
  slug,
  title,
  badge,
  excerpt,
  cover_image_bg,
  content,
  mid_content,
  seo_title,
  seo_description,
  keywords,
  status,
  is_featured,
  sort_order,
  published_at,
  -- published columns (same as draft on initial publish)
  published_title,
  published_badge,
  published_excerpt,
  published_cover_image_bg,
  published_content,
  published_mid_content,
  published_seo_title,
  published_seo_description,
  published_keywords,
  published_is_featured,
  has_unpublished_changes
) VALUES

-- Post 1: Featured
(
  '2025-tang-toc-media-he-sinh-thai-influence',
  '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence',
  'Event • Sắp diễn ra',
  'Nhìn lại một năm 2025 đầy biến động và tăng trưởng trong hệ sinh thái Media & Influence tại Việt Nam.',
  'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  '[
    {"id": "intro", "heading": null, "body": "Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime. However, traveling can also be stressful and overwhelming, especially if you don''t plan and prepare adequately. In this blog article, we''ll explore tips and tricks for a memorable journey and how to make the most of your travels.\n\nOne of the most rewarding aspects of traveling is immersing yourself in the local culture and customs. This includes trying local cuisine, attending cultural events and festivals, and interacting with locals. Learning a few phrases in the local language can also go a long way in making connections and showing respect."},
    {"id": "research", "heading": "Research Your Destination", "body": "Before embarking on your journey, take the time to research your destination. This includes understanding the local culture, customs, and laws, as well as identifying top attractions, restaurants, and accommodations. Doing so will help you navigate your destination with confidence and avoid any cultural faux pas.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In hendrerit gravida rutrum quisque non tellus orci ac auctor. Mi ipsum faucibus vitae aliquet nec ullamcorper sit amet. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Viverra adipiscing at in tellus."},
    {"id": "itinerary", "heading": "Plan Your Itinerary", "body": "While it''s essential to leave room for spontaneity and unexpected adventures, having a rough itinerary can help you make the most of your time and budget. Identify the must-see sights and experiences and prioritize them according to your interests and preferences. This will help you avoid overscheduling and ensure that you have time to relax and enjoy your journey.\n\nVitae sapien pellentesque habitant morbi tristique. Luctus venenatis lectus magna fringilla. Nec ullamcorper sit amet risus nullam eget felis. Tincidunt arcu non sodales neque sodales ut etiam sit amet."}
  ]'::jsonb,
  '[
    {"id": "packing", "heading": "Pack Lightly and Smartly", "body": "Packing can be a daunting task, but with some careful planning and smart choices, you can pack light and efficiently. Start by making a packing list and sticking to it, focusing on versatile and comfortable clothing that can be mixed and matched. Invest in quality luggage and packing organizers to maximize space and minimize wrinkles."},
    {"id": "health", "heading": "Stay Safe and Healthy", "body": "Traveling can expose you to new environments and potential health risks, so it''s crucial to take precautions to stay safe and healthy. This includes researching any required vaccinations or medications, staying hydrated, washing your hands frequently, and using sunscreen and insect repellent. It''s also essential to keep your valuables safe and secure and to be aware of your surroundings at all times."},
    {"id": "culture", "heading": "Immerse Yourself in the Local Culture", "body": "One of the most rewarding aspects of traveling is immersing yourself in the local culture and customs. This includes trying local cuisine, attending cultural events and festivals, and interacting with locals. Learning a few phrases in the local language can also go a long way in making connections and showing respect."},
    {"id": "memories", "heading": "Capture Memories", "body": "Finally, don''t forget to capture memories of your journey. Whether it''s through photographs, journaling, or souvenirs, preserving the moments and experiences of your travels can bring joy and nostalgia for years to come. However, it''s also essential to be present in the moment and not let technology distract you from the beauty of your surroundings."}
  ]'::jsonb,
  '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence | 3BROTHERS NETWORK',
  'Nhìn lại một năm 2025 đầy biến động và tăng trưởng trong hệ sinh thái Media & Influence tại Việt Nam.',
  ARRAY['media', 'influence', '3brothers', '2025', 'creator economy'],
  'published',
  true,
  1,
  '2026-01-12 00:00:00+00',
  '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence',
  'Event • Sắp diễn ra',
  'Nhìn lại một năm 2025 đầy biến động và tăng trưởng trong hệ sinh thái Media & Influence tại Việt Nam.',
  'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  '[
    {"id": "intro", "heading": null, "body": "Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime. However, traveling can also be stressful and overwhelming, especially if you don''t plan and prepare adequately. In this blog article, we''ll explore tips and tricks for a memorable journey and how to make the most of your travels.\n\nOne of the most rewarding aspects of traveling is immersing yourself in the local culture and customs. This includes trying local cuisine, attending cultural events and festivals, and interacting with locals. Learning a few phrases in the local language can also go a long way in making connections and showing respect."},
    {"id": "research", "heading": "Research Your Destination", "body": "Before embarking on your journey, take the time to research your destination. This includes understanding the local culture, customs, and laws, as well as identifying top attractions, restaurants, and accommodations. Doing so will help you navigate your destination with confidence and avoid any cultural faux pas.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
    {"id": "itinerary", "heading": "Plan Your Itinerary", "body": "While it''s essential to leave room for spontaneity and unexpected adventures, having a rough itinerary can help you make the most of your time and budget."}
  ]'::jsonb,
  '[
    {"id": "packing", "heading": "Pack Lightly and Smartly", "body": "Packing can be a daunting task, but with some careful planning and smart choices, you can pack light and efficiently."},
    {"id": "health", "heading": "Stay Safe and Healthy", "body": "Traveling can expose you to new environments and potential health risks, so it''s crucial to take precautions to stay safe and healthy."},
    {"id": "culture", "heading": "Immerse Yourself in the Local Culture", "body": "One of the most rewarding aspects of traveling is immersing yourself in the local culture and customs."},
    {"id": "memories", "heading": "Capture Memories", "body": "Finally, don''t forget to capture memories of your journey."}
  ]'::jsonb,
  '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence | 3BROTHERS NETWORK',
  'Nhìn lại một năm 2025 đầy biến động và tăng trưởng trong hệ sinh thái Media & Influence tại Việt Nam.',
  ARRAY['media', 'influence', '3brothers', '2025', 'creator economy'],
  true,
  false
),

-- Post 2
(
  'dong-hanh-xuan-ve-ban-em-2026',
  'Đồng hành cùng chương trình "Xuân Về Bản Em 2026"',
  'CSR • Cộng đồng',
  '3BROTHERS NETWORK đồng hành cùng chương trình thiện nguyện Xuân Về Bản Em 2026, mang Tết đến với các em nhỏ vùng cao.',
  'linear-gradient(135deg, #D4A020 0%, #E8B830 50%, #F0C840 100%)',
  '[
    {"id": "overview", "heading": null, "body": "3BROTHERS NETWORK tự hào đồng hành cùng chương trình ''Xuân Về Bản Em 2026'', một sáng kiến thiện nguyện mang ý nghĩa sâu sắc nhằm đưa mùa xuân và niềm vui đến với các em nhỏ tại vùng cao xa xôi. Đây là một trong những hoạt động CSR tiêu biểu của chúng tôi trong dịp Tết Nguyên Đán."},
    {"id": "activities", "heading": "Các hoạt động chính", "body": "Chương trình bao gồm nhiều hoạt động ý nghĩa như trao quà Tết, tổ chức vui chơi cho trẻ em, hỗ trợ học bổng và đóng góp vào quỹ xây dựng cơ sở hạ tầng địa phương. Đội ngũ creator và nhân viên 3BROTHERS đã trực tiếp tham gia và ghi lại những khoảnh khắc đáng nhớ."}
  ]'::jsonb,
  '[]'::jsonb,
  'Đồng hành cùng "Xuân Về Bản Em 2026" | 3BROTHERS NETWORK',
  '3BROTHERS NETWORK đồng hành chương trình thiện nguyện Xuân Về Bản Em 2026.',
  ARRAY['csr', 'thiện nguyện', 'xuân về bản em', '3brothers', 'cộng đồng'],
  'published',
  false,
  2,
  '2026-01-12 00:00:00+00',
  'Đồng hành cùng chương trình "Xuân Về Bản Em 2026"',
  'CSR • Cộng đồng',
  '3BROTHERS NETWORK đồng hành cùng chương trình thiện nguyện Xuân Về Bản Em 2026, mang Tết đến với các em nhỏ vùng cao.',
  'linear-gradient(135deg, #D4A020 0%, #E8B830 50%, #F0C840 100%)',
  '[
    {"id": "overview", "heading": null, "body": "3BROTHERS NETWORK tự hào đồng hành cùng chương trình ''Xuân Về Bản Em 2026''."},
    {"id": "activities", "heading": "Các hoạt động chính", "body": "Chương trình bao gồm nhiều hoạt động ý nghĩa như trao quà Tết, tổ chức vui chơi cho trẻ em."}
  ]'::jsonb,
  '[]'::jsonb,
  'Đồng hành cùng "Xuân Về Bản Em 2026" | 3BROTHERS NETWORK',
  '3BROTHERS NETWORK đồng hành chương trình thiện nguyện Xuân Về Bản Em 2026.',
  ARRAY['csr', 'thiện nguyện', 'xuân về bản em', '3brothers', 'cộng đồng'],
  false,
  false
),

-- Post 3
(
  '3brothers-media-x-wechoice-awards-2025',
  '3BROTHERS MEDIA x WECHOICE AWARDS 2025',
  'Awards • Sự kiện',
  '3BROTHERS MEDIA tự hào góp mặt tại WeChoice Awards 2025, giải thưởng vinh danh những đóng góp nổi bật trong cộng đồng số Việt Nam.',
  'linear-gradient(135deg, #C0C8D8 0%, #D8E0EE 50%, #B8C4D4 100%)',
  '[
    {"id": "overview", "heading": null, "body": "WeChoice Awards là giải thưởng thường niên vinh danh những cá nhân và tổ chức có đóng góp nổi bật nhất cho cộng đồng số và xã hội Việt Nam. Năm 2025, 3BROTHERS MEDIA tự hào đồng hành và có mặt tại sự kiện này với tư cách là đối tác truyền thông chiến lược."},
    {"id": "highlights", "heading": "Điểm nổi bật", "body": "Sự kiện quy tụ hàng trăm creator, nghệ sĩ và doanh nghiệp hàng đầu. 3BROTHERS đã hỗ trợ sản xuất nội dung, quản lý truyền thông cho nhiều creator được đề cử và đoạt giải tại WeChoice Awards 2025."}
  ]'::jsonb,
  '[]'::jsonb,
  '3BROTHERS MEDIA x WeChoice Awards 2025 | 3BROTHERS NETWORK',
  '3BROTHERS MEDIA đồng hành WeChoice Awards 2025, giải thưởng cộng đồng số hàng đầu Việt Nam.',
  ARRAY['wechoice', 'awards', '3brothers media', 'cộng đồng số', 'creator'],
  'published',
  false,
  3,
  '2026-01-12 00:00:00+00',
  '3BROTHERS MEDIA x WECHOICE AWARDS 2025',
  'Awards • Sự kiện',
  '3BROTHERS MEDIA tự hào góp mặt tại WeChoice Awards 2025.',
  'linear-gradient(135deg, #C0C8D8 0%, #D8E0EE 50%, #B8C4D4 100%)',
  '[
    {"id": "overview", "heading": null, "body": "WeChoice Awards là giải thưởng thường niên vinh danh những cá nhân và tổ chức có đóng góp nổi bật nhất cho cộng đồng số Việt Nam."},
    {"id": "highlights", "heading": "Điểm nổi bật", "body": "Sự kiện quy tụ hàng trăm creator, nghệ sĩ và doanh nghiệp hàng đầu."}
  ]'::jsonb,
  '[]'::jsonb,
  '3BROTHERS MEDIA x WeChoice Awards 2025 | 3BROTHERS NETWORK',
  '3BROTHERS MEDIA đồng hành WeChoice Awards 2025.',
  ARRAY['wechoice', 'awards', '3brothers media', 'cộng đồng số', 'creator'],
  false,
  false
);
