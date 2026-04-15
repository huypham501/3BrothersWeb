import { getHomePageData } from '../queries';
import { 
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

  const findSectionData = (schemaKey: string) => {
    const section = data.sections.find(s => s.schema_key === schemaKey);
    // Use published_enabled and published_content. If not yet published, fallback to empty/null
    return section && section.published_enabled ? section.published_content : null;
  };

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
    hero: findSectionData('home.hero.v1') as HomeHeroPayload | null,
    partners: findSectionData('home.partners.v1') as HomePartnersPayload | null,
    coreCompetencies: findSectionData('home.core_competencies.v1') as HomeCoreCompetenciesPayload | null,
    efficiency: findSectionData('home.efficiency.v1') as HomeEfficiencyPayload | null,
    trending: findSectionData('home.trending.v1') as HomeTrendingPayload | null,
    shared: {
      exclusiveTalents: (data.shared.exclusiveTalents?.published_enabled ? data.shared.exclusiveTalents.published_content : null) as SharedExclusiveTalentsPayload | null,
      contactCta: (data.shared.contactCta?.published_enabled ? data.shared.contactCta.published_content : null) as SharedContactCtaPayload | null,
    },
    globals: {
      header: (data.globals.header?.published_enabled ? data.globals.header.published_content : null) as GlobalHeaderPayload | null,
      footer: (data.globals.footer?.published_enabled ? data.globals.footer.published_content : null) as GlobalFooterPayload | null,
    }
  };
}
