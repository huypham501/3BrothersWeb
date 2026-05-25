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
  mode: 'manual';
  limit?: number | null;
  selected_post_ids?: string[] | null;
  // Derived at resolver layer from selected_post_ids for Home rendering.
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
    icon_image: string;
    icon_image_alt?: string | null;
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

export interface CtaPayload {
  heading: string;
  subtitle: string;
  cta_label: string;
  cta_url: string;
}

export interface ForBrandsHeroPayload {
  title: string;
  subtitle: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
}

export interface ForBrandsSolutionsPayload {
  section_title: string;
  items: [string, string, string, string];
}

export interface ForBrandsCaseStudiesPayload {
  section_title: string;
  brand_count_label?: string | null;
  brand_cards: Array<{
    name: string;
    handle: string;
    photo?: string | null;
    photo_alt?: string | null;
    description: string;
    brand_card_stat: string;
    stats?: Array<{
      value: string;
      label: string;
    }>;
    is_featured: boolean;
  }>;
}

export interface ForBrandsProgressPayload {
  section_title: string;
  section_subtitle: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
}

export interface ForBrandsCtaPayload {
  heading: string;
  subtitle: string;
  cta_label: string;
  cta_url: string;
}

export interface SocialCommerceSocialProofPayload {
  section_title: string;
  section_subtitle: string;
  items: Array<{
    id: 'live_commerce' | 'affiliate_marketing' | 'kol_marketplace' | 'bio_link' | 'brand_partnerships';
    title: string;
    description: string;
  }>;
}

export interface SocialCommerceHeroPayload {
  eyebrow: string;
  title: string;
  subtitle: string;
  services: Array<{
    id: 'live_commerce' | 'affiliate_marketing' | 'kol_marketplace' | 'bio_link' | 'brand_partnerships';
    label: string;
  }>;
}

export interface SocialCommerceGrowthPayload {
  heading: string;
  description: string;
  cta_label: string;
  cta_url: string;
  stats: Array<{
    id: 'services' | 'creators_kols' | 'brands';
    title: string;
    description: string;
  }>;
}

export interface SocialCommerceValuePropositionPayload {
  section_title: string;
  section_subtitle: string;
  items: Array<{
    id: 'diversification' | 'connection' | 'income';
    number: string;
    title: string;
    description: string;
  }>;
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
  cover_image_url: string | null;
  cover_image_alt: string | null;
  content: BlogPostContentSection[];
  mid_content: BlogPostContentSection[];
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  keywords: string[];
  is_featured: boolean;
}
