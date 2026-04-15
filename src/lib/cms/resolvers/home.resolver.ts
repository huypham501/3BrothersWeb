import { getHomePageData } from '../queries';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import type {
  HomeHeroPayload, 
  HomePartnersPayload, 
  HomeCoreCompetenciesPayload, 
  HomeEfficiencyPayload, 
  HomeTrendingPayload, 
  SharedExclusiveTalentsPayload, 
  SharedContactCtaPayload,
  GlobalHeaderPayload,
  GlobalFooterPayload
} from '../types';
import {
  findSectionContentBySchemaKey,
  resolveGlobalContentBySchemaKey,
  resolveSharedContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from './utils/cms-content';

export interface HomeViewModel {
  pageMeta: {
    title: string;
    description: string;
    canonical_url: string;
    og_image: string;
    og_image_alt: string;
    keywords: string[];
  };
  hero: HomeHeroPayload | null;
  partners: HomePartnersPayload | null;
  coreCompetencies: HomeCoreCompetenciesPayload | null;
  efficiency: HomeEfficiencyPayload | null;
  trending: HomeTrendingPayload | null;
  shared: {
    exclusiveTalents: SharedExclusiveTalentsPayload | null;
    contactCta: SharedContactCtaPayload | null;
  };
  globals: {
    header: GlobalHeaderPayload | null;
    footer: GlobalFooterPayload | null;
  };
}

export async function resolveHomePageData(): Promise<HomeViewModel | null> {
  const data = await getHomePageData();
  if (!data || !data.page) return null;

  const hero = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.HOME_HERO,
    findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.HOME_HERO),
    'home.sections.hero'
  );

  const partners = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.HOME_PARTNERS,
    findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.HOME_PARTNERS),
    'home.sections.partners'
  );

  const coreCompetencies = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.HOME_CORE_COMPETENCIES,
    findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.HOME_CORE_COMPETENCIES),
    'home.sections.core_competencies'
  );

  const efficiency = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.HOME_EFFICIENCY,
    findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.HOME_EFFICIENCY),
    'home.sections.efficiency'
  );

  const trending = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.HOME_TRENDING,
    findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.HOME_TRENDING),
    'home.sections.trending'
  );

  const sharedExclusiveTalents = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS,
    resolveSharedContentBySchemaKey<typeof SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS>(
      data.shared.exclusiveTalents
    ),
    'home.shared.exclusive_talents'
  );

  const sharedContactCta = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.SHARED_CONTACT_CTA,
    resolveSharedContentBySchemaKey<typeof SCHEMA_KEYS.SHARED_CONTACT_CTA>(data.shared.contactCta),
    'home.shared.contact_cta'
  );

  const globalHeader = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.GLOBAL_HEADER,
    resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_HEADER>(data.globals.header),
    'home.globals.header'
  );

  const globalFooter = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.GLOBAL_FOOTER,
    resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_FOOTER>(data.globals.footer),
    'home.globals.footer'
  );

  return {
    pageMeta: {
      title: data.page.published_seo_title || data.page.seo_title || "3BROTHERS NETWORK | The Leading Creator Economy Platform",
      description: data.page.published_seo_description || data.page.seo_description || "Make your passion your paycheck",
      canonical_url: data.page.canonical_url || "",
      og_image: data.page.published_og_image || data.page.og_image || "/3brothers.png",
      og_image_alt: data.page.published_og_image_alt || data.page.og_image_alt || "3BROTHERS NETWORK",
      keywords: data.page.published_keywords && data.page.published_keywords.length > 0 ? data.page.published_keywords : 
                (data.page.keywords && data.page.keywords.length > 0 ? data.page.keywords : ["youtube", "creators", "creator economy", "3brothers network"]),
    },
    hero,
    partners,
    coreCompetencies,
    efficiency,
    trending,
    shared: {
      exclusiveTalents: sharedExclusiveTalents,
      contactCta: sharedContactCta,
    },
    globals: {
      header: globalHeader,
      footer: globalFooter,
    }
  };
}
