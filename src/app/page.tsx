import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "3BROTHERS NETWORK | The Leading Creator Economy Platform",
  description: "Make your passion your paycheck",
  keywords: ["youtube", "creators", "creator economy", "3brothers network"],
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/en`,
      vi: `${SITE_URL}/vi`,
    },
  },
  openGraph: {
    title: "3BROTHERS NETWORK | The Leading Creator Economy Platform",
    description: "Make your passion your paycheck",
    url: SITE_URL,
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
    title: "3BROTHERS NETWORK | The Leading Creator Economy Platform",
    description: "Make your passion your paycheck",
    images: ["/3brothers.png"],
  },
};

export default function HomePage() {
  return <HomeView />;
}
