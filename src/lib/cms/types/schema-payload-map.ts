import type { SCHEMA_KEYS } from '../constants/schema-keys';
import type {
  ForCreatorsBenefitPayload,
  ForCreatorsCtaPayload,
  ForCreatorsHeroPayload,
  ForCreatorsTestimonialsPayload,
  GlobalFooterPayload,
  GlobalHeaderPayload,
  GlobalSeoDefaultsPayload,
  GlobalSiteMetadataPayload,
  HomeCoreCompetenciesPayload,
  HomeEfficiencyPayload,
  HomeHeroPayload,
  HomePartnersPayload,
  HomeTrendingPayload,
  SharedContactCtaPayload,
  SharedExclusiveTalentsPayload,
} from './payloads';

export interface CmsSchemaPayloadMap {
  [SCHEMA_KEYS.GLOBAL_HEADER]: GlobalHeaderPayload;
  [SCHEMA_KEYS.GLOBAL_FOOTER]: GlobalFooterPayload;
  [SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS]: GlobalSeoDefaultsPayload;
  [SCHEMA_KEYS.GLOBAL_SITE_METADATA]: GlobalSiteMetadataPayload;
  [SCHEMA_KEYS.HOME_HERO]: HomeHeroPayload;
  [SCHEMA_KEYS.HOME_PARTNERS]: HomePartnersPayload;
  [SCHEMA_KEYS.HOME_CORE_COMPETENCIES]: HomeCoreCompetenciesPayload;
  [SCHEMA_KEYS.HOME_EFFICIENCY]: HomeEfficiencyPayload;
  [SCHEMA_KEYS.HOME_TRENDING]: HomeTrendingPayload;
  [SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS]: SharedExclusiveTalentsPayload;
  [SCHEMA_KEYS.SHARED_CONTACT_CTA]: SharedContactCtaPayload;
  [SCHEMA_KEYS.FOR_CREATORS_HERO]: ForCreatorsHeroPayload;
  [SCHEMA_KEYS.FOR_CREATORS_BENEFIT]: ForCreatorsBenefitPayload;
  [SCHEMA_KEYS.FOR_CREATORS_TESTIMONIALS]: ForCreatorsTestimonialsPayload;
  [SCHEMA_KEYS.FOR_CREATORS_CTA]: ForCreatorsCtaPayload;
}

export type CmsSectionSchemaKey =
  | typeof SCHEMA_KEYS.HOME_HERO
  | typeof SCHEMA_KEYS.HOME_PARTNERS
  | typeof SCHEMA_KEYS.HOME_CORE_COMPETENCIES
  | typeof SCHEMA_KEYS.HOME_EFFICIENCY
  | typeof SCHEMA_KEYS.HOME_TRENDING
  | typeof SCHEMA_KEYS.FOR_CREATORS_HERO
  | typeof SCHEMA_KEYS.FOR_CREATORS_BENEFIT
  | typeof SCHEMA_KEYS.FOR_CREATORS_TESTIMONIALS
  | typeof SCHEMA_KEYS.FOR_CREATORS_CTA
  | typeof SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS
  | typeof SCHEMA_KEYS.SHARED_CONTACT_CTA;

export type CmsSharedSchemaKey =
  | typeof SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS
  | typeof SCHEMA_KEYS.SHARED_CONTACT_CTA;

export type CmsGlobalSchemaKey =
  | typeof SCHEMA_KEYS.GLOBAL_HEADER
  | typeof SCHEMA_KEYS.GLOBAL_FOOTER
  | typeof SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS
  | typeof SCHEMA_KEYS.GLOBAL_SITE_METADATA;
