import type { Metadata } from 'next';

// Public page — served from ISR cache, revalidated only via Publish Center.
export const revalidate = false;

import { ForBrandsView } from '@/components/forBrands/ForBrandsView';
import { SITE_URL } from '@/lib/constants';
import { getPageBySlug } from '@/lib/cms/queries';
import { resolvePageMetadataModel } from '@/lib/cms/resolvers/metadata-defaults.resolver';
import { resolveForBrandsPageData } from '@/lib/cms/resolvers/for-brands.resolver';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('for-brands');
  const metadata = await resolvePageMetadataModel({
    page,
    pagePath: '/for-brands',
    fallbackTitle: 'For Brands | 3BROTHERS NETWORK',
    fallbackDescription:
      'Kết nối thương hiệu với influencers phù hợp để tăng trưởng chiến dịch marketing.',
    fallbackKeywords: ['for brands', 'influencer marketing', 'creator economy', '3brothers network'],
    fallbackSiteUrl: SITE_URL,
    fallbackOgImage: '/3brothers-512x512.png',
    fallbackOgImageAlt: '3BROTHERS NETWORK',
  });

  return {
    metadataBase: new URL(metadata.metadata_base_url),
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    robots: metadata.robots,
    alternates: {
      canonical: metadata.canonical_url,
      languages: {
        en: `${SITE_URL}/en/for-brands`,
        vi: `${SITE_URL}/vi/for-brands`,
      },
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: metadata.canonical_url,
      siteName: metadata.site_name,
      type: 'website',
      images: [
        {
          url: metadata.og_image,
          alt: metadata.og_image_alt,
        },
      ],
    },
    twitter: {
      card: metadata.twitter_card,
      title: metadata.title,
      description: metadata.description,
      images: [metadata.og_image],
    },
  };
}

export default async function ForBrandsPage() {
  const data = await resolveForBrandsPageData();
  if (!data) return null;

  return (
    <ForBrandsView
      data={{
        hero: data.hero
          ? {
              title: data.hero.title,
              subtitle: data.hero.subtitle,
              primaryCtaLabel: data.hero.primary_cta_label,
              primaryCtaUrl: data.hero.primary_cta_url,
              secondaryCtaLabel: data.hero.secondary_cta_label ?? undefined,
              secondaryCtaUrl: data.hero.secondary_cta_url ?? undefined,
            }
          : null,
        solutions: data.solutions
          ? {
              title: data.solutions.section_title,
              items: data.solutions.items,
            }
          : null,
        caseStudies: data.caseStudies
          ? {
              title: data.caseStudies.section_title,
              brandCountLabel: data.caseStudies.brand_count_label ?? undefined,
              brandCards: data.caseStudies.brand_cards.map((card) => ({
                name: card.name,
                handle: card.handle,
                photo: card.photo ?? undefined,
                photoAlt: card.photo_alt ?? undefined,
                description: card.description,
                stats: card.stats,
                isFeatured: card.is_featured,
              })),
            }
          : null,
        progress: data.progress
          ? {
              title: data.progress.section_title,
              subtitle: data.progress.section_subtitle,
              steps: data.progress.steps,
            }
          : null,
        cta: data.cta
          ? {
              heading: data.cta.heading,
              subtitle: data.cta.subtitle,
              ctaLabel: data.cta.cta_label,
              ctaUrl: data.cta.cta_url,
            }
          : null,
        globals: data.globals,
      }}
    />
  );
}
