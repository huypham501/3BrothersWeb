import { z } from 'zod';
import { SCHEMA_KEYS } from '../constants/schema-keys';

const urlOrHash = z.string().regex(/^(https?:\/\/|\/|#)/, { error: 'Must be a valid URL, relative path, or #' }).max(500);

export const homePageSchema = z.object({
  slug: z.string().min(1),
  internal_name: z.string().max(80),
  status: z.enum(['draft', 'published']),
  seo_title: z.string().max(70),
  seo_description: z.string().max(160),
  og_image: z.string().max(1024).nullable().optional(),
  og_image_alt: z.string().max(125).nullable().optional(),
  canonical_url: z.string().max(1024).nullable().optional(),
  keywords: z.array(z.string().max(40)).max(10),
});

export const globalHeaderSchema = z.object({
  logo_text: z.string().max(20),
  logo_image: z.string().nullable().optional(),
  nav_links: z.array(
    z.object({
      label: z.string().max(40),
      url: urlOrHash,
    })
  ).min(1).max(8),
  cta_label: z.string().max(30),
  cta_url: urlOrHash,
});

export const globalFooterSchema = z.object({
  thank_you_heading: z.string().max(120),
  email: z.email(),
  address: z.string().max(200),
  menu_links: z.array(
    z.object({
      label: z.string().max(40),
      url: urlOrHash,
    })
  ).min(1).max(10),
  social_links: z.array(
    z.object({
      label: z.string().max(40),
      url: urlOrHash,
    })
  ).min(1).max(8),
  brand_watermark: z.string().max(30),
});

export const globalSeoDefaultsSchema = z.object({
  default_title_template: z.string().max(120),
  default_meta_description: z.string().max(160),
  default_keywords: z.array(z.string().max(40)).max(15),
  default_og_image: z.string().max(1024),
  default_og_image_alt: z.string().max(125),
  default_twitter_card_type: z.enum(['summary', 'summary_large_image']),
  default_robots: z.string().max(80),
});

export const globalSiteMetadataSchema = z.object({
  site_name: z.string().max(80),
  site_url: z.url().max(500),
  default_canonical_base: z.url().max(500),
  brand_name: z.string().max(80),
  publisher_name: z.string().max(80),
});

export const sharedExclusiveTalentsSchema = z.object({
  section_title: z.string().max(80),
  featured_name: z.string().max(60),
  featured_handle: z.string().max(40),
  featured_photo: z.string().nullable().optional(),
  featured_photo_alt: z.string().max(125).nullable().optional(),
  featured_description: z.string().max(800),
  featured_stats: z.array(
    z.object({
      value: z.string().max(20),
      label: z.string().max(30),
    })
  ).length(2),
  talent_count_label: z.string().max(20).nullable().optional(),
  talents: z.array(
    z.object({
      name: z.string().max(60),
      photo: z.string().nullable().optional(),
      photo_alt: z.string().max(125).nullable().optional(),
    })
  ).min(1).max(20),
});

export const sharedContactCtaSchema = z.object({
  title: z.string().max(120),
  subtitle: z.string().max(400),
  cta_label: z.string().max(40),
  cta_url: urlOrHash,
});

export const homeHeroSchema = z.object({
  title: z.string().max(120),
  subtext: z.string().max(300),
  primary_cta_label: z.string().max(40),
  primary_cta_url: urlOrHash,
  secondary_cta_label: z.string().max(40).nullable().optional(),
  secondary_cta_url: urlOrHash.nullable().optional(),
  media_image: z.string().nullable().optional(),
  media_image_alt: z.string().max(125).nullable().optional(),
});

export const homePartnersSchema = z.object({
  section_label: z.string().max(80).nullable().optional(),
  partners: z.array(
    z.object({
      name: z.string().max(60),
      logo_image: z.string().nullable().optional(),
      url: urlOrHash.nullable().optional(),
    })
  ).min(1).max(20),
});

export const homeCoreCompetenciesSchema = z.object({
  section_title: z.string().max(80),
  services: z.array(
    z.object({
      title: z.string().max(60),
      description: z.string().max(300),
      image: z.string().nullable().optional(),
      link_url: urlOrHash.nullable().optional(),
    })
  ).min(1).max(8),
});

export const homeEfficiencySchema = z.object({
  section_title: z.string().max(100),
  description: z.string().max(400),
  primary_cta_label: z.string().max(40),
  primary_cta_url: urlOrHash,
  secondary_cta_label: z.string().max(40).nullable().optional(),
  secondary_cta_url: urlOrHash.nullable().optional(),
  stats: z.array(
    z.object({
      title: z.string().max(60),
      description: z.string().max(100).nullable().optional(),
      number: z.string().max(20),
    })
  ).min(1).max(6),
});

export const homeTrendingSchema = z.object({
  section_title: z.string().max(80),
  view_all_label: z.string().max(40).nullable().optional(),
  view_all_url: urlOrHash.nullable().optional(),
  news_source: z.enum(['manual', 'auto_latest']),
  news_limit: z.number().min(1).max(6).nullable().optional(),
  news_items: z.array(
    z.object({
      title: z.string().max(120),
      date: z.string().max(20),
      image: z.string().nullable().optional(),
      image_alt: z.string().max(125).nullable().optional(),
      url: urlOrHash.nullable().optional(),
    })
  ).min(1).max(6).nullable().optional(),
});

export const forCreatorsHeroSchema = z.object({
  title: z.string().max(120),
  subtitle: z.string().max(500),
  primary_cta_label: z.string().max(40),
  primary_cta_url: urlOrHash,
  secondary_cta_label: z.string().max(40),
  secondary_cta_url: urlOrHash,
});

export const forCreatorsBenefitSchema = z.object({
  section_title: z.string().max(120),
  section_description: z.string().max(500),
  contact_cta_label: z.string().max(40),
  contact_cta_url: urlOrHash,
  benefits: z.array(
    z.object({
      id: z.enum(['income', 'brand', 'management', 'content']),
      title: z.string().max(80),
      description: z.string().max(300),
    })
  ).length(4),
});

export const forCreatorsTestimonialsSchema = z.object({
  superlabel: z.string().max(120),
  section_title: z.string().max(120),
  testimonials: z.array(
    z.object({
      quote: z.string().max(400),
      name: z.string().max(60),
      role: z.string().max(120),
    })
  ).min(1).max(6),
});

export const forCreatorsCtaSchema = z.object({
  heading: z.string().max(180),
  subtitle: z.string().max(300),
  cta_label: z.string().max(40),
  cta_url: urlOrHash,
});

export const CMS_REGISTRY = {
  [SCHEMA_KEYS.GLOBAL_HEADER]: globalHeaderSchema,
  [SCHEMA_KEYS.GLOBAL_FOOTER]: globalFooterSchema,
  [SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS]: globalSeoDefaultsSchema,
  [SCHEMA_KEYS.GLOBAL_SITE_METADATA]: globalSiteMetadataSchema,
  [SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS]: sharedExclusiveTalentsSchema,
  [SCHEMA_KEYS.SHARED_CONTACT_CTA]: sharedContactCtaSchema,
  [SCHEMA_KEYS.HOME_HERO]: homeHeroSchema,
  [SCHEMA_KEYS.HOME_PARTNERS]: homePartnersSchema,
  [SCHEMA_KEYS.HOME_CORE_COMPETENCIES]: homeCoreCompetenciesSchema,
  [SCHEMA_KEYS.HOME_EFFICIENCY]: homeEfficiencySchema,
  [SCHEMA_KEYS.HOME_TRENDING]: homeTrendingSchema,
  [SCHEMA_KEYS.FOR_CREATORS_HERO]: forCreatorsHeroSchema,
  [SCHEMA_KEYS.FOR_CREATORS_BENEFIT]: forCreatorsBenefitSchema,
  [SCHEMA_KEYS.FOR_CREATORS_TESTIMONIALS]: forCreatorsTestimonialsSchema,
  [SCHEMA_KEYS.FOR_CREATORS_CTA]: forCreatorsCtaSchema,
};
