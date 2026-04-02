import type { Metadata } from "next";
import { BlogView } from "@/components/blog/BlogView";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Blog | 3BROTHERS MEDIA",
  description: "Cập nhật tin tức, xu hướng và câu chuyện từ 3Brothers Media — nơi kết nối thương hiệu với các KOLs/Influencers hàng đầu.",
  keywords: ["blog", "3brothers", "KOL", "influencer", "media", "tin tức"],
  alternates: {
    canonical: `${SITE_URL}/blogs`,
    languages: {
      en: `${SITE_URL}/en/blogs`,
      vi: `${SITE_URL}/vi/blogs`,
    },
  },
  openGraph: {
    title: "Blog | 3BROTHERS MEDIA",
    description: "Cập nhật tin tức, xu hướng và câu chuyện từ 3Brothers Media.",
    url: `${SITE_URL}/blogs`,
    type: "website",
    images: [
      {
        url: "/3brothers.png",
        alt: "3BROTHERS MEDIA Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | 3BROTHERS MEDIA",
    description: "Cập nhật tin tức, xu hướng và câu chuyện từ 3Brothers Media.",
    images: ["/3brothers.png"],
  },
};

export default function BlogPage() {
  return <BlogView />;
}
