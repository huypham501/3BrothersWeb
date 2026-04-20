import { getForCreatorsPageData } from '../queries';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import type {
  ForCreatorsHeroPayload,
  ForCreatorsBenefitPayload,
  ForCreatorsTestimonialsPayload,
  ForCreatorsCtaPayload,
  SharedExclusiveTalentsPayload,
  SharedContactCtaPayload,
  GlobalHeaderPayload,
  GlobalFooterPayload,
} from '../types';
import {
  findSectionContentBySchemaKey,
  resolveGlobalContentBySchemaKey,
  resolveSharedContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from './utils/cms-content';

export interface ForCreatorsViewModel {
  pageMeta: {
    title: string;
    description: string;
    canonical_url: string;
    og_image: string;
    og_image_alt: string;
    keywords: string[];
  };
  hero: ForCreatorsHeroPayload | null;
  benefit: ForCreatorsBenefitPayload | null;
  testimonials: ForCreatorsTestimonialsPayload | null;
  cta: ForCreatorsCtaPayload | null;
  shared: {
    exclusiveTalents: SharedExclusiveTalentsPayload | null;
    contactCta: SharedContactCtaPayload | null;
  };
  globals: {
    header: GlobalHeaderPayload | null;
    footer: GlobalFooterPayload | null;
  };
}

export async function resolveForCreatorsPageData(): Promise<ForCreatorsViewModel | null> {
  const data = await getForCreatorsPageData();
  if (!data || !data.page) return null;

  return {
    pageMeta: {
      title: data.page.published_seo_title || 'For Creators | 3BROTHERS NETWORK',
      description: data.page.published_seo_description || 'Grow your community. Maximize your opportunity.',
      canonical_url: '/for-creators',
      og_image: data.page.published_og_image || '/3brothers.png',
      og_image_alt: data.page.published_og_image_alt || '3BROTHERS NETWORK',
      keywords:
        data.page.published_keywords && data.page.published_keywords.length > 0
          ? data.page.published_keywords
          : ['creator', 'creators', 'creator program', '3brothers network'],
    },
    hero: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.FOR_CREATORS_HERO,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_CREATORS_HERO),
      'for-creators.sections.hero'
    ),
    benefit: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.FOR_CREATORS_BENEFIT,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_CREATORS_BENEFIT),
      'for-creators.sections.benefit'
    ),
    testimonials: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.FOR_CREATORS_TESTIMONIALS,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_CREATORS_TESTIMONIALS),
      'for-creators.sections.testimonials'
    ),
    cta: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.FOR_CREATORS_CTA,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_CREATORS_CTA),
      'for-creators.sections.cta'
    ),
    shared: {
      exclusiveTalents: resolveSharedContentBySchemaKey<typeof SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS>(
        data.shared.exclusiveTalents
      ),
      contactCta: resolveSharedContentBySchemaKey<typeof SCHEMA_KEYS.SHARED_CONTACT_CTA>(
        data.shared.contactCta
      ),
    },
    globals: {
      header: resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_HEADER>(data.globals.header),
      footer: resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_FOOTER>(data.globals.footer),
    },
  };
}
