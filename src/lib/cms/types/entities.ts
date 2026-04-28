export type CmsPublishStatus = 'draft' | 'published';
export type CmsRole = 'super_admin' | 'content_admin' | 'editor' | 'viewer';

export interface CmsPage {
  id: string;
  slug: string;
  internal_name: string;
  status: CmsPublishStatus;
  seo_title: string;
  seo_description: string;
  og_image: string | null;
  og_image_alt: string | null;
  canonical_url: string | null;
  keywords: string[];
  
  published_seo_title?: string;
  published_seo_description?: string;
  published_og_image?: string | null;
  published_og_image_alt?: string | null;
  published_keywords?: string[];
  has_unpublished_changes?: boolean;
  last_edited_by_identifier?: string | null;
  last_edited_at?: string | null;
  last_published_by_identifier?: string | null;
  last_published_at?: string | null;

  created_at: string;
  updated_at: string;
}

export interface CmsPageSection<TPayload = unknown> {
  id: string;
  page_id: string;
  schema_key: string;
  section_key: string;
  sort_order: number;
  enabled: boolean;
  content: TPayload;

  published_content?: TPayload;
  published_enabled?: boolean;
  has_unpublished_changes?: boolean;
  last_edited_by_identifier?: string | null;
  last_edited_at?: string | null;
  last_published_by_identifier?: string | null;
  last_published_at?: string | null;

  created_at: string;
  updated_at: string;
}

export interface CmsSharedSection<TPayload = unknown> {
  id: string;
  schema_key: string;
  section_key: string;
  enabled: boolean;
  content: TPayload;

  published_content?: TPayload;
  published_enabled?: boolean;
  has_unpublished_changes?: boolean;
  last_edited_by_identifier?: string | null;
  last_edited_at?: string | null;
  last_published_by_identifier?: string | null;
  last_published_at?: string | null;

  created_at: string;
  updated_at: string;
}

export interface CmsGlobalSetting<TPayload = unknown> {
  id: string;
  schema_key: string;
  setting_key: string;
  enabled: boolean;
  content: TPayload;

  published_content?: TPayload;
  published_enabled?: boolean;
  has_unpublished_changes?: boolean;
  last_edited_by_identifier?: string | null;
  last_edited_at?: string | null;
  last_published_by_identifier?: string | null;
  last_published_at?: string | null;

  created_at: string;
  updated_at: string;
}

export interface CmsBlogPost {
  id: string;
  slug: string;
  title: string;
  badge: string | null;
  excerpt: string | null;
  cover_image_bg: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_aspect_ratio: string | null;
  content: Array<{ id: string; heading: string | null; body: string }>;
  mid_content: Array<{ id: string; heading: string | null; body: string }>;

  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  keywords: string[];

  status: CmsPublishStatus;
  is_featured: boolean;
  sort_order: number;
  published_at: string | null;

  // Published columns
  published_title: string | null;
  published_badge: string | null;
  published_excerpt: string | null;
  published_cover_image_bg: string | null;
  published_cover_image_url: string | null;
  published_cover_image_alt: string | null;
  published_cover_aspect_ratio: string | null;
  published_content: Array<{ id: string; heading: string | null; body: string }> | null;
  published_mid_content: Array<{ id: string; heading: string | null; body: string }> | null;
  published_seo_title: string | null;
  published_seo_description: string | null;
  published_og_image: string | null;
  published_keywords: string[] | null;
  published_is_featured: boolean | null;
  has_unpublished_changes: boolean;

  last_edited_by: string | null;
  last_edited_by_identifier: string | null;
  last_edited_at: string | null;
  last_published_by: string | null;
  last_published_by_identifier: string | null;
  last_published_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface CmsJobPosition {
  id: string;
  slug: string;
  title: string;
  department: string | null;

  /** Draft JSONB content — JobPositionContent shape */
  content: {
    title: string;
    department: string;
    type: string;
    location: string;
    experience: string;
    salary: string;
    short_description: string;
    descriptions: string[];
    requirements: string[];
    benefits: string[];
  };

  /** Published JSONB content — same shape as content */
  published_content: CmsJobPosition['content'] | null;

  status: CmsPublishStatus;
  sort_order: number;
  published_at: string | null;
  has_unpublished_changes: boolean;

  last_edited_by: string | null;
  last_edited_by_identifier: string | null;
  last_edited_at: string | null;
  last_published_by: string | null;
  last_published_by_identifier: string | null;
  last_published_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface CmsAuditLog {
  id: string;
  actor_user_id: string;
  actor_email_or_identifier: string;
  actor_role: CmsRole;
  action_type: 'save_draft' | 'publish';
  entity_type: 'page' | 'page_section' | 'shared_section' | 'global_setting' | 'blog_post' | 'job_position';
  entity_id: string | null;
  entity_key_or_id: string;
  page_slug_or_schema_key: string | null;
  summary: string;
  created_at: string;
}
