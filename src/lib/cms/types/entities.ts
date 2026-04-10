export type CmsPublishStatus = 'draft' | 'published';

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
  created_at: string;
  updated_at: string;
}

export interface CmsPageSection<TPayload = any> {
  id: string;
  page_id: string;
  schema_key: string;
  section_key: string;
  sort_order: number;
  enabled: boolean;
  content: TPayload;
  created_at: string;
  updated_at: string;
}

export interface CmsSharedSection<TPayload = any> {
  id: string;
  schema_key: string;
  section_key: string;
  enabled: boolean;
  content: TPayload;
  created_at: string;
  updated_at: string;
}

export interface CmsGlobalSetting<TPayload = any> {
  id: string;
  schema_key: string;
  setting_key: string;
  enabled: boolean;
  content: TPayload;
  created_at: string;
  updated_at: string;
}
