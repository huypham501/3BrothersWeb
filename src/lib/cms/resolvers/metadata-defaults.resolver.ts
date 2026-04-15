import { getGlobalSetting } from '../queries';
import { SCHEMA_KEYS } from '../constants/schema-keys';
import type { CmsPage, GlobalSeoDefaultsPayload, GlobalSiteMetadataPayload } from '../types';

export interface ResolvedMetadataModel {
  title: string;
  description: string;
  keywords: string[];
  og_image: string;
  og_image_alt: string;
  canonical_url: string;
  twitter_card: 'summary' | 'summary_large_image';
  robots: string;
  metadata_base_url: string;
  site_name: string;
}

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function normalizePath(path: string) {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function buildCanonical(base: string, path: string) {
  return `${trimTrailingSlash(base)}${normalizePath(path)}`;
}

function applyTitleTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => values[key] || '').trim();
}

export async function resolvePublishedMetadataDefaults() {
  const [seoRecord, siteRecord] = await Promise.all([
    getGlobalSetting(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS),
    getGlobalSetting(SCHEMA_KEYS.GLOBAL_SITE_METADATA),
  ]);

  const seo = seoRecord?.published_enabled ? (seoRecord.published_content as GlobalSeoDefaultsPayload) : null;
  const site = siteRecord?.published_enabled ? (siteRecord.published_content as GlobalSiteMetadataPayload) : null;

  return { seo, site };
}

interface ResolvePageMetadataInput {
  page: CmsPage | null;
  pagePath: string;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackKeywords: string[];
  fallbackSiteUrl: string;
  fallbackOgImage: string;
  fallbackOgImageAlt: string;
}

export async function resolvePageMetadataModel(input: ResolvePageMetadataInput): Promise<ResolvedMetadataModel> {
  const { seo, site } = await resolvePublishedMetadataDefaults();

  const siteName = site?.site_name || '3BROTHERS NETWORK';
  const baseUrl = site?.site_url || input.fallbackSiteUrl;
  const canonicalBase = site?.default_canonical_base || site?.site_url || input.fallbackSiteUrl;

  const titleFromTemplate = seo?.default_title_template
    ? applyTitleTemplate(seo.default_title_template, {
        page_title: input.fallbackTitle,
        site_name: site?.site_name || '',
        brand_name: site?.brand_name || '',
      })
    : '';

  const title =
    input.page?.published_seo_title ||
    titleFromTemplate ||
    site?.site_name ||
    input.fallbackTitle;

  const description =
    input.page?.published_seo_description ||
    seo?.default_meta_description ||
    input.fallbackDescription;

  const keywords =
    input.page?.published_keywords && input.page.published_keywords.length > 0
      ? input.page.published_keywords
      : seo?.default_keywords && seo.default_keywords.length > 0
        ? seo.default_keywords
        : input.fallbackKeywords;

  const ogImage = input.page?.published_og_image || seo?.default_og_image || input.fallbackOgImage;
  const ogImageAlt = input.page?.published_og_image_alt || seo?.default_og_image_alt || input.fallbackOgImageAlt;

  return {
    title,
    description,
    keywords,
    og_image: ogImage,
    og_image_alt: ogImageAlt,
    canonical_url: buildCanonical(canonicalBase, input.pagePath),
    twitter_card: seo?.default_twitter_card_type || 'summary_large_image',
    robots: seo?.default_robots || 'index,follow',
    metadata_base_url: baseUrl,
    site_name: siteName,
  };
}
