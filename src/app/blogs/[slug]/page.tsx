import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogDetailView } from '@/components/blog/BlogDetailView';
import { getPublishedBlogPostBySlug, getRelatedBlogPosts } from '@/lib/cms/queries';
import type { ArticleData } from '@/components/blog/sections/DetailMainContentSection';
import type { BlogPost } from '@/components/blog/components/BlogPostCard';
import { resolvePublicLayoutData } from '@/lib/cms/resolvers/public-layout.resolver';

import { SITE_URL } from '@/lib/constants';

export const revalidate = false;

interface Props {
  params: Promise<{ slug: string }>;
}

function formatBlogDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | 3BROTHERS MEDIA',
    };
  }

  const title = post.published_seo_title ?? post.seo_title ?? `${post.published_title ?? post.title} | 3BROTHERS MEDIA`;
  const description =
    post.published_seo_description ??
    post.seo_description ??
    (post.published_excerpt ?? post.excerpt ?? '');
  const ogImage = post.published_og_image ?? post.og_image ?? '/3brothers.png';
  const keywords = (post.published_keywords ?? post.keywords ?? []).length > 0
    ? (post.published_keywords ?? post.keywords ?? [])
    : ['blog', '3brothers', 'KOL', 'influencer', 'media'];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    alternates: {
      canonical: `${SITE_URL}/blogs/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blogs/${slug}`,
      type: 'article',
      images: [{ url: ogImage, alt: post.published_title ?? post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  const [post, related, layout] = await Promise.all([
    getPublishedBlogPostBySlug(slug),
    getRelatedBlogPosts(slug, 3),
    resolvePublicLayoutData(),
  ]);

  if (!post) notFound();

  const publishedContent = post.published_content ?? post.content ?? [];
  const publishedMidContent = post.published_mid_content ?? post.mid_content ?? [];

  const article: ArticleData = {
    title: post.published_title ?? post.title,
    badge: post.published_badge ?? post.badge,
    date: formatBlogDate(post.published_at),
    heroImageBg:
      post.published_cover_image_bg ??
      post.cover_image_bg ??
      'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
    sections: publishedContent.map((s) => ({
      id: s.id,
      heading: s.heading,
      body: s.body,
    })),
    midSections: publishedMidContent.map((s) => ({
      id: s.id,
      heading: s.heading,
      body: s.body,
    })),
  };

  const relatedPosts: BlogPost[] = related.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.published_title ?? p.title,
    date: new Date(p.published_at ?? p.created_at)
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase(),
    imageBg:
      p.published_cover_image_bg ??
      p.cover_image_bg ??
      'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  }));

  return (
    <BlogDetailView
      article={article}
      relatedPosts={relatedPosts}
      header={layout.header}
      footer={layout.footer}
      contactCta={layout.contactCta}
    />
  );
}
