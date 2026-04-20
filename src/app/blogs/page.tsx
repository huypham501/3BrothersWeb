import type { Metadata } from "next";
import { BlogView } from "@/components/blog/BlogView";
import { getPublishedBlogPosts, getFeaturedBlogPost } from "@/lib/cms/queries";
import type { FeaturedPost } from "@/components/blog/sections/HighlightsSection";
import type { BlogPost } from "@/components/blog/components/BlogPostCard";

import { SITE_URL } from "@/lib/constants";

export const revalidate = false;

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

function formatBlogDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

export default async function BlogPage() {
  const [featuredRaw, allPosts] = await Promise.all([
    getFeaturedBlogPost(),
    getPublishedBlogPosts(),
  ]);

  const featuredPost: FeaturedPost | undefined = featuredRaw
    ? {
        slug: featuredRaw.slug,
        title: featuredRaw.published_title ?? featuredRaw.title,
        badge: featuredRaw.published_badge ?? featuredRaw.badge,
        excerpt: featuredRaw.published_excerpt ?? featuredRaw.excerpt,
        date: formatBlogDate(featuredRaw.published_at),
        heroBg:
          featuredRaw.published_cover_image_bg ??
          featuredRaw.cover_image_bg ??
          'linear-gradient(180deg, #001a5c 0%, #003CA6 35%, #0050d0 60%, #061530 100%)',
      }
    : undefined;

  const posts: BlogPost[] = allPosts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.published_title ?? p.title,
    date: formatBlogDate(p.published_at),
    imageBg:
      p.published_cover_image_bg ??
      p.cover_image_bg ??
      'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  }));

  return <BlogView featuredPost={featuredPost} posts={posts} />;
}
