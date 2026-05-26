import { z } from 'zod';
import { getForBrandsPageData } from '../queries';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import type {
  ForBrandsCaseStudiesPayload,
  ForBrandsCategoriesPayload,
  ForBrandsCtaPayload,
  ForBrandsHeroPayload,
  ForBrandsProgressPayload,
  ForBrandsSolutionsPayload,
  GlobalFooterPayload,
  GlobalHeaderPayload,
} from '../types';
import {
  findSectionContentBySchemaKey,
  resolveGlobalContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from './utils/cms-content';

export interface ForBrandsViewModel {
  pageMeta: {
    title: string;
    description: string;
    canonical_url: string;
    og_image: string;
    og_image_alt: string;
    keywords: string[];
  };
  hero: ForBrandsHeroPayload | null;
  solutions: ForBrandsSolutionsPayload | null;
  caseStudies: ForBrandsCaseStudiesPayload | null;
  categories: ForBrandsCategoriesPayload | null;
  progress: ForBrandsProgressPayload | null;
  cta: ForBrandsCtaPayload | null;
  globals: {
    header: GlobalHeaderPayload | null;
    footer: GlobalFooterPayload | null;
  };
}

const caseStudiesBrandCardSchema = z.object({
  name: z.string().max(80),
  handle: z.string().max(40),
  photo: z.string().max(1024).nullable().optional(),
  photo_alt: z.string().max(125).nullable().optional(),
  featured_photo: z.string().max(1024).nullable().optional(),
  featured_photo_alt: z.string().max(125).nullable().optional(),
  description: z.string().max(1000),
  brand_card_stat: z.string().max(120),
  stats: z.array(z.object({
    value: z.string().max(40),
    label: z.string().max(60),
  })).length(2).optional(),
  is_featured: z.boolean(),
});
const caseStudiesMetaSchema = z.object({
  section_title: z.string().max(120),
  brand_count_label: z.string().max(20).nullable().optional(),
});

function normalizeCaseStudiesPayload(
  payload: unknown
): ForBrandsCaseStudiesPayload | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const meta = caseStudiesMetaSchema.safeParse(record);
  if (!meta.success) {
    const details = meta.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`).join('; ');
    console.warn(`[cms:read-validation] Invalid core payload key=${SCHEMA_KEYS.FOR_BRANDS_CASE_STUDIES}; ${details}`);
    return null;
  }
  const rawCards = Array.isArray(record.brand_cards) ? record.brand_cards : [];

  const normalizeText = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return '';
  };

  const normalizeLegacyStats = (value: unknown, legacyMetric: unknown): [{ value: string; label: string }, { value: string; label: string }] => {
    if (Array.isArray(value) && value.length === 2) {
      return [
        {
          label: normalizeText((value[0] as Record<string, unknown> | undefined)?.label),
          value: normalizeText((value[0] as Record<string, unknown> | undefined)?.value),
        },
        {
          label: normalizeText((value[1] as Record<string, unknown> | undefined)?.label),
          value: normalizeText((value[1] as Record<string, unknown> | undefined)?.value),
        },
      ];
    }

    return [
      { label: 'Metric', value: normalizeText(legacyMetric) },
      { label: '', value: '' },
    ];
  };

  const brand_cards = rawCards
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        console.warn(`[cms:read-validation] Filtered invalid item key=${SCHEMA_KEYS.FOR_BRANDS_CASE_STUDIES}.brand_cards index=${index}; Invalid object`);
        return null;
      }
      const raw = item as Record<string, unknown>;
      const normalized = {
        name: typeof raw.name === 'string' ? raw.name : (typeof raw.brand === 'string' ? raw.brand : ''),
        handle: typeof raw.handle === 'string' ? raw.handle : '',
        photo: typeof raw.photo === 'string'
          ? raw.photo
          : (typeof raw.image === 'string' ? raw.image : null),
        photo_alt: typeof raw.photo_alt === 'string'
          ? raw.photo_alt
          : (typeof raw.image_alt === 'string' ? raw.image_alt : null),
        featured_photo: typeof raw.featured_photo === 'string'
          ? raw.featured_photo
          : (typeof raw.featured_media_image === 'string' ? raw.featured_media_image : null),
        featured_photo_alt: typeof raw.featured_photo_alt === 'string'
          ? raw.featured_photo_alt
          : (typeof raw.featured_media_image_alt === 'string' ? raw.featured_media_image_alt : null),
        description: typeof raw.description === 'string'
          ? raw.description
          : (typeof raw.metric === 'string' ? raw.metric : ''),
        brand_card_stat: typeof raw.brand_card_stat === 'string' && raw.brand_card_stat.trim().length > 0
          ? raw.brand_card_stat
          : normalizeText((raw.stats as Array<Record<string, unknown>> | undefined)?.[0]?.value || raw.metric),
        stats: normalizeLegacyStats(raw.stats, raw.metric),
        is_featured: typeof raw.is_featured === 'boolean'
          ? raw.is_featured
          : (typeof raw.active === 'boolean' ? raw.active : false),
      };
      const parsed = caseStudiesBrandCardSchema.safeParse(normalized);
      if (!parsed.success) {
        const details = parsed.error.issues.map((issue) => issue.message).join('; ');
        console.warn(`[cms:read-validation] Filtered invalid item key=${SCHEMA_KEYS.FOR_BRANDS_CASE_STUDIES}.brand_cards index=${index}; ${details}`);
        return null;
      }
      return parsed.data;
    })
    .filter((item): item is z.infer<typeof caseStudiesBrandCardSchema> => !!item);

  const featuredCount = brand_cards.filter((card) => card.is_featured).length;
  const normalizedBrandCards = featuredCount === 1
    ? brand_cards
    : brand_cards.map((card, index) => ({
      ...card,
      is_featured: index === 0,
    }));
  const featuredCard = normalizedBrandCards.find((card) => card.is_featured);
  const orderedBrandCards = featuredCard
    ? [featuredCard, ...normalizedBrandCards.filter((card) => card !== featuredCard)]
    : normalizedBrandCards;

  return {
    section_title: meta.data.section_title,
    brand_count_label: meta.data.brand_count_label ?? null,
    brand_cards: orderedBrandCards,
  };
}

export async function resolveForBrandsPageData(): Promise<ForBrandsViewModel | null> {
  const data = await getForBrandsPageData();
  if (!data || !data.page) return null;

  return {
    pageMeta: {
      title: data.page.published_seo_title || 'For Brands | 3BROTHERS NETWORK',
      description:
        data.page.published_seo_description ||
        'Kết nối thương hiệu với influencers phù hợp để tăng trưởng chiến dịch marketing.',
      canonical_url: '/for-brands',
      og_image: data.page.published_og_image || '/3brothers-512x512.png',
      og_image_alt: data.page.published_og_image_alt || '3BROTHERS NETWORK',
      keywords:
        data.page.published_keywords && data.page.published_keywords.length > 0
          ? data.page.published_keywords
          : ['for brands', 'influencer marketing', 'creator economy', '3brothers network'],
    },
    hero: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.FOR_BRANDS_HERO,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_BRANDS_HERO),
      'for-brands.sections.hero'
    ),
    solutions: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.FOR_BRANDS_SOLUTIONS,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_BRANDS_SOLUTIONS),
      'for-brands.sections.solutions'
    ),
    caseStudies: normalizeCaseStudiesPayload(
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_BRANDS_CASE_STUDIES)
    ),
    categories: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.FOR_BRANDS_CATEGORIES,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_BRANDS_CATEGORIES),
      'for-brands.sections.categories'
    ),
    progress: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.FOR_BRANDS_PROGRESS,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_BRANDS_PROGRESS),
      'for-brands.sections.progress'
    ),
    cta: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.FOR_BRANDS_CTA,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_BRANDS_CTA),
      'for-brands.sections.cta'
    ),
    globals: {
      header: validateCmsPayloadBySchemaKey(
        SCHEMA_KEYS.GLOBAL_HEADER,
        resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_HEADER>(data.globals.header),
        'for-brands.globals.header'
      ),
      footer: validateCmsPayloadBySchemaKey(
        SCHEMA_KEYS.GLOBAL_FOOTER,
        resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_FOOTER>(data.globals.footer),
        'for-brands.globals.footer'
      ),
    },
  };
}
