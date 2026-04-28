export interface GlobalHeaderPayload {
  logo_text: string;
  logo_image?: string | null;
  nav_links: Array<{
    label: string;
    url: string;
  }>;
  cta_label: string;
  cta_url: string;
}

export interface GlobalFooterPayload {
  thank_you_heading: string;
  email: string;
  address: string;
  menu_links: Array<{
    label: string;
    url: string;
  }>;
  social_links: Array<{
    label: string;
    url: string;
  }>;
  brand_watermark: string;
}

export interface GlobalSeoDefaultsPayload {
  default_title_template: string;
  default_meta_description: string;
  default_keywords: string[];
  default_og_image: string;
  default_og_image_alt: string;
  default_twitter_card_type: 'summary' | 'summary_large_image';
  default_robots: string;
}

export interface GlobalSiteMetadataPayload {
  site_name: string;
  site_url: string;
  default_canonical_base: string;
  brand_name: string;
  publisher_name: string;
}

export interface HomeHeroPayload {
  title: string;
  subtext: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
  media_image?: string | null;
  media_image_alt?: string | null;
  hero_aspect_ratio?: string | null;
}

export interface HomePartnersPayload {
  partners: Array<{
    name: string;
    logo_image?: string | null;
    url?: string | null;
  }>;
}

export interface HomeCoreCompetenciesPayload {
  section_title: string;
  services: Array<{
    title: string;
    description: string;
    image?: string | null;
    link_url?: string | null;
  }>;
}

export interface HomeEfficiencyPayload {
  section_title: string;
  description: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
  stats: Array<{
    title: string;
    description?: string | null;
    number: string;
  }>;
}

export interface HomeTrendingPayload {
  section_title: string;
  view_all_label?: string | null;
  view_all_url?: string | null;
  news_source: 'manual' | 'auto_latest';
  news_limit?: number | null;
  news_items?: Array<{
    title: string;
    date: string;
    image?: string | null;
    image_alt?: string | null;
    url?: string | null;
  }> | null;
}

export interface SharedExclusiveTalentsPayload {
  section_title: string;
  talent_count_label?: string | null;
  talents: Array<{
    name: string;
    handle: string;
    photo?: string | null;
    photo_alt?: string | null;
    description: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
    is_featured: boolean;
  }>;
}

export interface SharedContactCtaPayload {
  title: string;
  subtitle: string;
  cta_label: string;
  cta_url: string;
}

export interface ForCreatorsHeroPayload {
  title: string;
  subtitle: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  media_image?: string | null;
  media_image_alt?: string | null;
  hero_aspect_ratio?: string | null;
}

export interface ForCreatorsBenefitPayload {
  section_title: string;
  section_description: string;
  contact_cta_label: string;
  contact_cta_url: string;
  benefits: Array<{
    id: 'income' | 'brand' | 'management' | 'content';
    title: string;
    description: string;
  }>;
}

export interface ForCreatorsTestimonialsPayload {
  superlabel: string;
  section_title: string;
  testimonials: Array<{
    quote: string;
    name: string;
    role: string;
  }>;
}

export interface ForCreatorsCtaPayload {
  heading: string;
  subtitle: string;
  cta_label: string;
  cta_url: string;
}

// ── Careers ──────────────────────────────────────────────────────────────────

export interface CareersHeroPerk {
  id: 'grow' | 'team' | 'creative';
  icon: 'grow' | 'team' | 'creative';
  title: string;
  description: string;
}

export interface CareersHeroPayload {
  superlabel: string;
  title: string;
  subtitle: string;
  perks: CareersHeroPerk[];
}

/** Shape of the content / published_content JSONB columns for a job position. */
export interface JobPositionContent {
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
}

// ── Blog Posts ───────────────────────────────────────────────────────────────

export interface BlogPostContentSection {
  id: string;
  heading: string | null;
  body: string;
}

/** Shape the admin editor saves for a blog post (draft save & publish). */
export interface BlogPostFormPayload {
  title: string;
  badge: string | null;
  excerpt: string | null;
  cover_image_bg: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_aspect_ratio: string | null;
  content: BlogPostContentSection[];
  mid_content: BlogPostContentSection[];
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  keywords: string[];
  is_featured: boolean;
}
