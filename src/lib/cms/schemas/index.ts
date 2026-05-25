import { z } from 'zod';
import { SCHEMA_KEYS } from '../constants/schema-keys';

const urlOrHash = z.string().regex(/^(https?:\/\/|\/|#)/, { error: 'Must be a valid URL, relative path, or #' }).max(500);

/** Generic page settings schema — used for all CMS-managed pages (Home, For Creators, …) */
export const pageSettingsSchema = z.object({
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

/** @deprecated Use pageSettingsSchema */
export const homePageSchema = pageSettingsSchema;

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

const sharedExclusiveTalentItemSchema = z.object({
  name: z.string().max(60),
  handle: z.string().max(40),
  photo: z.string().nullable().optional(),
  photo_alt: z.string().max(125).nullable().optional(),
  description: z.string().max(800),
  stats: z.array(
    z.object({
      value: z.string().max(20),
      label: z.string().max(30),
    })
  ).length(2),
  is_featured: z.boolean(),
});

export const sharedExclusiveTalentsSchema = z.object({
  section_title: z.string().max(80),
  talent_count_label: z.string().max(20).nullable().optional(),
  talents: z.array(sharedExclusiveTalentItemSchema).min(1).max(20),
}).superRefine((value, ctx) => {
  const featuredCount = value.talents.filter((talent) => talent.is_featured).length;
  if (featuredCount !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Exactly one talent must be featured.',
      path: ['talents'],
    });
  }
});

export const sharedContactCtaSchema = z.object({
  title: z.string().max(120),
  subtitle: z.string().max(400),
  cta_label: z.string().max(40),
  cta_url: urlOrHash,
});

export const sharedCtaSchema = z.object({
  heading: z.string().max(180),
  subtitle: z.string().max(300),
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
  mode: z.literal('manual'),
  limit: z.number().min(1).max(6).nullable().optional(),
  selected_post_ids: z.array(z.string().uuid()).max(6).nullable().optional(),
}).superRefine((value, ctx) => {
  const ids = value.selected_post_ids ?? [];
  const limit = value.limit ?? 3;
  if (ids.length > limit) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Selected posts cannot exceed limit (${limit}).`,
      path: ['selected_post_ids'],
    });
  }

  if (new Set(ids).size !== ids.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Duplicate posts are not allowed.',
      path: ['selected_post_ids'],
    });
  }
});

export const forCreatorsHeroSchema = z.object({
  title: z.string().max(120),
  subtitle: z.string().max(500),
  primary_cta_label: z.string().max(40),
  primary_cta_url: urlOrHash,
  secondary_cta_label: z.string().max(40),
  secondary_cta_url: urlOrHash,
  media_image: z.string().nullable().optional(),
  media_image_alt: z.string().max(125).nullable().optional(),
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
      icon_image: z.string().min(1).max(1024),
      icon_image_alt: z.string().max(125).nullable().optional(),
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

export const forBrandsHeroSchema = z.object({
  title: z.string().max(120),
  subtitle: z.string().max(500),
  primary_cta_label: z.string().max(40),
  primary_cta_url: urlOrHash,
  secondary_cta_label: z.string().max(40).nullable().optional(),
  secondary_cta_url: urlOrHash.nullable().optional(),
});

export const forBrandsSolutionsSchema = z.object({
  section_title: z.string().max(120),
  items: z.array(z.string().max(80)).length(4),
});

export const forBrandsCaseStudiesSchema = z.object({
  section_title: z.string().max(120),
  brand_count_label: z.string().max(20).nullable().optional(),
  brand_cards: z.array(
    z.object({
      name: z.string().max(80),
      handle: z.string().max(40),
      photo: z.string().max(1024).nullable().optional(),
      photo_alt: z.string().max(125).nullable().optional(),
      description: z.string().max(1000),
      stats: z.array(
        z.object({
          value: z.string().max(40),
          label: z.string().max(60),
        })
      ).length(2),
      is_featured: z.boolean(),
    })
  ).min(1).max(20),
}).superRefine((value, ctx) => {
  const featuredCount = value.brand_cards.filter((card) => card.is_featured).length;
  if (featuredCount !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Exactly one brand card must be featured.',
      path: ['brand_cards'],
    });
  }
});

export const forBrandsProgressSchema = z.object({
  section_title: z.string().max(120),
  section_subtitle: z.string().max(500),
  steps: z.array(
    z.object({
      title: z.string().max(120),
      description: z.string().max(500),
    })
  ).length(4),
});

export const forBrandsCtaSchema = z.object({
  heading: z.string().max(180),
  subtitle: z.string().max(300),
  cta_label: z.string().max(40),
  cta_url: urlOrHash,
});

export const socialCommerceSocialProofSchema = z.object({
  section_title: z.string().max(120),
  section_subtitle: z.string().max(300),
  items: z.array(
    z.object({
      id: z.enum(['live_commerce', 'affiliate_marketing', 'kol_marketplace', 'bio_link', 'brand_partnerships']),
      title: z.string().max(80),
      description: z.string().max(300),
    })
  ).length(5),
});

export const socialCommerceHeroSchema = z.object({
  eyebrow: z.string().max(80),
  title: z.string().max(120),
  subtitle: z.string().max(300),
  services: z.array(
    z.object({
      id: z.enum(['live_commerce', 'affiliate_marketing', 'kol_marketplace', 'bio_link', 'brand_partnerships']),
      label: z.string().max(80),
    })
  ).length(5),
});

export const socialCommerceGrowthSchema = z.object({
  heading: z.string().max(180),
  description: z.string().max(500),
  cta_label: z.string().max(40),
  cta_url: urlOrHash,
  stats: z.array(
    z.object({
      id: z.enum(['services', 'creators_kols', 'brands']),
      title: z.string().max(80),
      description: z.string().max(300),
    })
  ).length(3),
});

export const socialCommerceValuePropositionSchema = z.object({
  section_title: z.string().max(120),
  section_subtitle: z.string().max(300),
  items: z.array(
    z.object({
      id: z.enum(['diversification', 'connection', 'income']),
      number: z.string().max(10),
      title: z.string().max(80),
      description: z.string().max(300),
    })
  ).length(3),
});

// ── Careers ──────────────────────────────────────────────────────────────────

export const careersHeroPerkSchema = z.object({
  id: z.enum(['grow', 'team', 'creative']),
  icon: z.enum(['grow', 'team', 'creative']),
  title: z.string().max(80),
  description: z.string().max(300),
});

export const careersHeroSchema = z.object({
  superlabel: z.string().max(80),
  title: z.string().max(200),
  subtitle: z.string().max(500),
  perks: z.array(careersHeroPerkSchema).length(3),
});

export const jobPositionContentSchema = z.object({
  title: z.string().min(1).max(200),
  department: z.string().max(80),
  type: z.string().max(60),
  location: z.string().max(120),
  experience: z.string().max(120),
  salary: z.string().max(120),
  short_description: z.string().max(400),
  descriptions: z.array(z.string().max(500)).max(10),
  requirements: z.array(z.string().max(500)).max(20),
  benefits: z.array(z.string().max(500)).max(20),
});

// ── Blog Posts ───────────────────────────────────────────────────────────────

export const blogPostContentSectionSchema = z.object({
  id: z.string().min(1).max(60),
  heading: z.string().max(120).nullable(),
  body: z.string().min(1),
});

export const blogPostFormSchema = z.object({
  title: z.string().min(1).max(200),
  badge: z.string().max(60).nullable().optional(),
  excerpt: z.string().max(300).nullable().optional(),
  cover_image_url: z.string().max(1024).nullable().optional(),
  cover_image_alt: z.string().max(125).nullable().optional(),
  content: z.array(blogPostContentSectionSchema).max(20),
  mid_content: z.array(blogPostContentSectionSchema).max(20),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(160).nullable().optional(),
  og_image: z.string().max(1024).nullable().optional(),
  keywords: z.array(z.string().max(40)).max(15),
  is_featured: z.boolean(),
});

export const CMS_REGISTRY = {
  [SCHEMA_KEYS.GLOBAL_HEADER]: globalHeaderSchema,
  [SCHEMA_KEYS.GLOBAL_FOOTER]: globalFooterSchema,
  [SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS]: globalSeoDefaultsSchema,
  [SCHEMA_KEYS.GLOBAL_SITE_METADATA]: globalSiteMetadataSchema,
  [SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS]: sharedExclusiveTalentsSchema,
  [SCHEMA_KEYS.SHARED_CONTACT_CTA]: sharedContactCtaSchema,
  [SCHEMA_KEYS.SHARED_CTA]: sharedCtaSchema,
  [SCHEMA_KEYS.HOME_HERO]: homeHeroSchema,
  [SCHEMA_KEYS.HOME_PARTNERS]: homePartnersSchema,
  [SCHEMA_KEYS.HOME_CORE_COMPETENCIES]: homeCoreCompetenciesSchema,
  [SCHEMA_KEYS.HOME_EFFICIENCY]: homeEfficiencySchema,
  [SCHEMA_KEYS.HOME_TRENDING]: homeTrendingSchema,
  [SCHEMA_KEYS.FOR_CREATORS_HERO]: forCreatorsHeroSchema,
  [SCHEMA_KEYS.FOR_CREATORS_BENEFIT]: forCreatorsBenefitSchema,
  [SCHEMA_KEYS.FOR_CREATORS_TESTIMONIALS]: forCreatorsTestimonialsSchema,
  [SCHEMA_KEYS.FOR_CREATORS_CTA]: forCreatorsCtaSchema,
  [SCHEMA_KEYS.FOR_BRANDS_HERO]: forBrandsHeroSchema,
  [SCHEMA_KEYS.FOR_BRANDS_SOLUTIONS]: forBrandsSolutionsSchema,
  [SCHEMA_KEYS.FOR_BRANDS_CASE_STUDIES]: forBrandsCaseStudiesSchema,
  [SCHEMA_KEYS.FOR_BRANDS_PROGRESS]: forBrandsProgressSchema,
  [SCHEMA_KEYS.FOR_BRANDS_CTA]: forBrandsCtaSchema,
  [SCHEMA_KEYS.SOCIAL_COMMERCE_HERO]: socialCommerceHeroSchema,
  [SCHEMA_KEYS.SOCIAL_COMMERCE_GROWTH]: socialCommerceGrowthSchema,
  [SCHEMA_KEYS.SOCIAL_COMMERCE_VALUE_PROPOSITION]: socialCommerceValuePropositionSchema,
  [SCHEMA_KEYS.SOCIAL_COMMERCE_SOCIAL_PROOF]: socialCommerceSocialProofSchema,
  [SCHEMA_KEYS.CAREERS_HERO]: careersHeroSchema,
};
