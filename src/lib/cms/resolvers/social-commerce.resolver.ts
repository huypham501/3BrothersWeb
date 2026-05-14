import { getSocialCommercePageData } from '../queries';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import type {
  GlobalFooterPayload,
  GlobalHeaderPayload,
  SocialCommerceGrowthPayload,
  SocialCommerceHeroPayload,
  SocialCommerceSocialProofPayload,
  SocialCommerceValuePropositionPayload,
} from '../types';
import {
  findSectionContentBySchemaKey,
  resolveGlobalContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from './utils/cms-content';

export interface SocialCommerceViewModel {
  hero: SocialCommerceHeroPayload | null;
  growth: SocialCommerceGrowthPayload | null;
  socialProof: SocialCommerceSocialProofPayload | null;
  valueProposition: SocialCommerceValuePropositionPayload | null;
  globals: {
    header: GlobalHeaderPayload | null;
    footer: GlobalFooterPayload | null;
  };
}

export async function resolveSocialCommercePageData(): Promise<SocialCommerceViewModel | null> {
  const data = await getSocialCommercePageData();
  if (!data || !data.page) return null;

  return {
    hero: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.SOCIAL_COMMERCE_HERO,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.SOCIAL_COMMERCE_HERO),
      'social-commerce.sections.hero'
    ),
    growth: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.SOCIAL_COMMERCE_GROWTH,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.SOCIAL_COMMERCE_GROWTH),
      'social-commerce.sections.growth'
    ),
    socialProof: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.SOCIAL_COMMERCE_SOCIAL_PROOF,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.SOCIAL_COMMERCE_SOCIAL_PROOF),
      'social-commerce.sections.social-proof'
    ),
    valueProposition: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.SOCIAL_COMMERCE_VALUE_PROPOSITION,
      findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.SOCIAL_COMMERCE_VALUE_PROPOSITION),
      'social-commerce.sections.value-proposition'
    ),
    globals: {
      header: validateCmsPayloadBySchemaKey(
        SCHEMA_KEYS.GLOBAL_HEADER,
        resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_HEADER>(data.globals.header),
        'social-commerce.globals.header'
      ),
      footer: validateCmsPayloadBySchemaKey(
        SCHEMA_KEYS.GLOBAL_FOOTER,
        resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_FOOTER>(data.globals.footer),
        'social-commerce.globals.footer'
      ),
    },
  };
}
