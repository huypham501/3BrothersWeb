import type { Metadata } from 'next';

// Public page — served from ISR cache, revalidated only via Publish Center.
export const revalidate = false;
import { ForCreatorsView } from '@/components/forCreators/ForCreatorsView';

import { SITE_URL } from '@/lib/constants';
import { getPageBySlug } from '@/lib/cms/queries';
import { resolvePageMetadataModel } from '@/lib/cms/resolvers/metadata-defaults.resolver';
import { resolveForCreatorsPageData } from '@/lib/cms/resolvers/for-creators.resolver';
import { resolveSharedContactCtaData } from '@/lib/cms/resolvers/shared-contact-cta.resolver';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('for-creators');
  const metadata = await resolvePageMetadataModel({
    page,
    pagePath: '/for-creators',
    fallbackTitle: 'For Creators | 3BROTHERS NETWORK',
    fallbackDescription: 'Grow your community. Maximize your opportunity.',
    fallbackKeywords: ['creator', 'creators', 'creator program', '3brothers network'],
    fallbackSiteUrl: SITE_URL,
    fallbackOgImage: '/3brothers.png',
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
        en: `${SITE_URL}/en/for-creators`,
        vi: `${SITE_URL}/vi/for-creators`,
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

export default async function ForCreatorsPage() {
  const [data, contactCta] = await Promise.all([
    resolveForCreatorsPageData(),
    resolveSharedContactCtaData(),
  ]);
  return <ForCreatorsView data={data} contactCta={contactCta} />;
}
