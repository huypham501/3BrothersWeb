import type { Metadata } from "next";
import { OurBrandView } from "@/components/ourBrand/OurBrandView";

const SITE_URL = "https://3brothers.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Our Brands | 3BROTHERS NETWORK",
  description:
    "We help brands achieve meaningful growth with intelligent social video advertising. Get the engagement you deserve.",
  keywords: ["our brands", "brands", "3brothers network"],
  alternates: {
    canonical: `${SITE_URL}/our-brand`,
    languages: {
      en: `${SITE_URL}/en/our-brand`,
      vi: `${SITE_URL}/vi/our-brand`,
    },
  },
  openGraph: {
    title: "Our Brands | 3BROTHERS NETWORK",
    description:
      "We help brands achieve meaningful growth with intelligent social video advertising. Get the engagement you deserve.",
    url: `${SITE_URL}/our-brand`,
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
    title: "Our Brands | 3BROTHERS NETWORK",
    description:
      "We help brands achieve meaningful growth with intelligent social video advertising. Get the engagement you deserve.",
    images: ["/3brothers.png"],
  },
};

export default function OurBrandPage() {
  return <OurBrandView />;
}

