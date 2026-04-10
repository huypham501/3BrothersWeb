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
  section_label?: string | null;
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
  featured_name: string;
  featured_handle: string;
  featured_photo?: string | null;
  featured_photo_alt?: string | null;
  featured_description: string;
  featured_stats: Array<{
    value: string;
    label: string;
  }>;
  talent_count_label?: string | null;
  talents: Array<{
    name: string;
    photo?: string | null;
    photo_alt?: string | null;
  }>;
}

export interface SharedContactCtaPayload {
  title: string;
  subtitle: string;
  cta_label: string;
  cta_url: string;
}
