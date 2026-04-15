import { getForCreatorsPageData } from '../queries';
import {
  ForCreatorsHeroPayload,
  ForCreatorsBenefitPayload,
  ForCreatorsTestimonialsPayload,
  ForCreatorsCtaPayload,
  SharedExclusiveTalentsPayload,
  SharedContactCtaPayload,
  GlobalHeaderPayload,
  GlobalFooterPayload,
} from '../types';

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

  const findSectionData = (schemaKey: string) => {
    const section = data.sections.find((s) => s.schema_key === schemaKey);
    return section && section.published_enabled ? section.published_content : null;
  };

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
    hero: findSectionData('for_creators.hero.v1') as ForCreatorsHeroPayload | null,
    benefit: findSectionData('for_creators.benefit.v1') as ForCreatorsBenefitPayload | null,
    testimonials: findSectionData('for_creators.testimonials.v1') as ForCreatorsTestimonialsPayload | null,
    cta: findSectionData('for_creators.cta.v1') as ForCreatorsCtaPayload | null,
    shared: {
      exclusiveTalents: (data.shared.exclusiveTalents?.published_enabled ? data.shared.exclusiveTalents.published_content : null) as SharedExclusiveTalentsPayload | null,
      contactCta: (data.shared.contactCta?.published_enabled ? data.shared.contactCta.published_content : null) as SharedContactCtaPayload | null,
    },
    globals: {
      header: (data.globals.header?.published_enabled ? data.globals.header.published_content : null) as GlobalHeaderPayload | null,
      footer: (data.globals.footer?.published_enabled ? data.globals.footer.published_content : null) as GlobalFooterPayload | null,
    },
  };
}
