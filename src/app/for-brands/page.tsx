import type { Metadata } from "next";
import { ForBrandsView } from "@/components/forBrands/ForBrandsView";

const SITE_URL = "https://3brothers.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "For Brands | 3BROTHERS NETWORK",
  description: "One-stop shop digital video marketing agency for brands.",
  keywords: ["brand", "brands", "influencer marketing", "3brothers network"],
  alternates: {
    canonical: `${SITE_URL}/for-brands`,
    languages: {
      en: `${SITE_URL}/en/for-brands`,
      vi: `${SITE_URL}/vi/for-brands`,
    },
  },
  openGraph: {
    title: "For Brands | 3BROTHERS NETWORK",
    description: "One-stop shop digital video marketing agency for brands.",
    url: `${SITE_URL}/for-brands`,
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
    title: "For Brands | 3BROTHERS NETWORK",
    description: "One-stop shop digital video marketing agency for brands.",
    images: ["/3brothers.png"],
  },
};

export default function ForBrandsPage() {
  return <ForBrandsView />;
}

