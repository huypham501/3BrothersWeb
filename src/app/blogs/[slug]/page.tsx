import type { Metadata } from 'next';
import { BlogDetailView } from '@/components/blog/BlogDetailView';

import { SITE_URL } from '@/lib/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // TODO: fetch real article data by slug from CMS/API
  const title = '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence';
  const description =
    'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.';

  return {
    metadataBase: new URL(SITE_URL),
    title: `${title} | 3BROTHERS MEDIA`,
    description,
    keywords: ['blog', '3brothers', 'KOL', 'influencer', 'media'],
    alternates: {
      canonical: `${SITE_URL}/blogs/${slug}`,
    },
    openGraph: {
      title: `${title} | 3BROTHERS MEDIA`,
      description,
      url: `${SITE_URL}/blogs/${slug}`,
      type: 'article',
      images: [{ url: '/3brothers.png', alt: '3BROTHERS MEDIA' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | 3BROTHERS MEDIA`,
      description,
      images: ['/3brothers.png'],
    },
  };
}

export default function BlogDetailPage() {
  return <BlogDetailView />;
}
