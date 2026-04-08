import type { Metadata } from "next";
import { CareersView } from "@/components/careers/CareersView";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Careers | 3BROTHERS NETWORK",
  description: "Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.",
  keywords: ["careers", "tuyển dụng", "influencer marketing", "3brothers network", "việc làm"],
  alternates: {
    canonical: `${SITE_URL}/careers`,
    languages: {
      en: `${SITE_URL}/en/careers`,
      vi: `${SITE_URL}/vi/careers`,
    },
  },
  openGraph: {
    title: "Careers | 3BROTHERS NETWORK",
    description: "Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.",
    url: `${SITE_URL}/careers`,
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
    title: "Careers | 3BROTHERS NETWORK",
    description: "Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.",
    images: ["/3brothers.png"],
  },
};

export default function CareersPage() {
  return <CareersView />;
}
