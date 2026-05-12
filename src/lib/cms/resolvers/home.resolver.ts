import { getHomePageData } from '../queries';
import { getPublishedBlogPosts } from '../queries';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import type {
  HomeHeroPayload, 
  HomePartnersPayload, 
  HomeCoreCompetenciesPayload, 
  HomeEfficiencyPayload, 
  HomeTrendingPayload, 
  SharedExclusiveTalentsPayload, 
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
  };
  globals: {
    header: GlobalHeaderPayload | null;
    footer: GlobalFooterPayload | null;
  };
}

export async function resolveHomePageData(): Promise<HomeViewModel | null> {
  const data = await getHomePageData();
  if (!data || !data.page) return null;
  const publishedPosts = await getPublishedBlogPosts();

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

  const resolvedTrending: HomeTrendingPayload | null = (() => {
    if (!trending) return null;

    const selectedIds = trending.selected_post_ids ?? [];
    const limit = trending.limit ?? 3;
    const postById = new Map(publishedPosts.map((post) => [post.id, post]));

    const curatedItems = selectedIds
      .map((id) => postById.get(id))
      .filter((post): post is NonNullable<typeof post> => Boolean(post))
      .slice(0, limit)
      .map((post) => {
        const publishedDate = post.published_at ? new Date(post.published_at) : null;
        const dateText = publishedDate
          ? publishedDate
              .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              .toUpperCase()
          : '';

        return {
          title: post.published_title || post.title,
          date: dateText,
          image: post.published_cover_image_url || post.cover_image_url,
          image_alt: post.published_cover_image_alt || post.cover_image_alt || post.published_title || post.title,
          url: `/blogs/${post.slug}`,
        };
      });

    return {
      ...trending,
      mode: 'manual',
      news_items: curatedItems,
    };
  })();

  const sharedExclusiveTalents = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS,
    resolveSharedContentBySchemaKey<typeof SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS>(
      data.shared.exclusiveTalents
    ),
    'home.shared.exclusive_talents'
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
      og_image: data.page.published_og_image || data.page.og_image || "/3brothers-512x512.png",
      og_image_alt: data.page.published_og_image_alt || data.page.og_image_alt || "3BROTHERS NETWORK",
      keywords: data.page.published_keywords && data.page.published_keywords.length > 0 ? data.page.published_keywords : 
                (data.page.keywords && data.page.keywords.length > 0 ? data.page.keywords : ["youtube", "creators", "creator economy", "3brothers network"]),
    },
    hero,
    partners,
    coreCompetencies,
    efficiency,
    trending: resolvedTrending,
    shared: {
      exclusiveTalents: sharedExclusiveTalents,
    },
    globals: {
      header: globalHeader,
      footer: globalFooter,
    }
  };
}
