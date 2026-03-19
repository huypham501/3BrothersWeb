import type { Metadata } from "next";
import { ForCreatorsView } from "@/components/forCreators/ForCreatorsView";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "For Creators | 3BROTHERS NETWORK",
  description: "Grow your community. Maximize your opportunity.",
  keywords: ["creator", "creators", "creator program", "3brothers network"],
  alternates: {
    canonical: `${SITE_URL}/for-creators`,
    languages: {
      en: `${SITE_URL}/en/for-creators`,
      vi: `${SITE_URL}/vi/for-creators`,
    },
  },
  openGraph: {
    title: "For Creators | 3BROTHERS NETWORK",
    description: "Grow your community. Maximize your opportunity.",
    url: `${SITE_URL}/for-creators`,
    type: "website",
    images: [
      {
        url: "/3brothers.png",
        alt: "3BROTHERS NETWORK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "For Creators | 3BROTHERS NETWORK",
    description: "Grow your community. Maximize your opportunity.",
    images: ["/3brothers.png"],
  },
};

export default function ForCreatorsPage() {
  return <ForCreatorsView />;
}

