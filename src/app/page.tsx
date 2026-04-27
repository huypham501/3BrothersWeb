import type { Metadata } from "next";

// Public page — served from ISR cache, revalidated only via Publish Center.
export const revalidate = false;
import { HomeView } from "@/components/home/HomeView";

import { SITE_URL } from "@/lib/constants";
import { getPageBySlug } from "@/lib/cms/queries";
import { resolvePageMetadataModel } from "@/lib/cms/resolvers/metadata-defaults.resolver";
import { resolveHomePageData } from "@/lib/cms/resolvers/home.resolver";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home');
  const metadata = await resolvePageMetadataModel({
    page,
    pagePath: '/',
    fallbackTitle: "3BROTHERS NETWORK | The Leading Creator Economy Platform",
    fallbackDescription: "Make your passion your paycheck",
    fallbackKeywords: ["youtube", "creators", "creator economy", "3brothers network"],
    fallbackSiteUrl: SITE_URL,
    fallbackOgImage: "/3brothers.png",
    fallbackOgImageAlt: "3BROTHERS NETWORK",
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
        en: `${SITE_URL}/en`,
        vi: `${SITE_URL}/vi`,
      },
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: metadata.canonical_url,
      siteName: metadata.site_name,
      type: "website",
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

export default async function HomePage() {
  const data = await resolveHomePageData();
  
  // If no CMS data exists yet, we could fallback, but we assume the admin seeded it
  return <HomeView data={data} />;
}
