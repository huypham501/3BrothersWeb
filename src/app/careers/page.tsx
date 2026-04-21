import type { Metadata } from 'next';
import { CareersView } from '@/components/careers/CareersView';
import { getCareersHeroSection, getPublishedJobPositions } from '@/lib/cms/queries';
import type { JobPosition } from '@/components/careers/data/jobPositions';
import type { CmsJobPosition } from '@/lib/cms';
import { SITE_URL } from '@/lib/constants';
import { resolvePublicLayoutData } from '@/lib/cms/resolvers/public-layout.resolver';

export const revalidate = false;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Careers | 3BROTHERS NETWORK',
  description: 'Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.',
  keywords: ['careers', 'tuyển dụng', 'influencer marketing', '3brothers network', 'việc làm'],
  alternates: {
    canonical: `${SITE_URL}/careers`,
    languages: {
      en: `${SITE_URL}/en/careers`,
      vi: `${SITE_URL}/vi/careers`,
    },
  },
  openGraph: {
    title: 'Careers | 3BROTHERS NETWORK',
    description: 'Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.',
    url: `${SITE_URL}/careers`,
    type: 'website',
    images: [{ url: '/3brothers.png', alt: '3BROTHERS NETWORK' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | 3BROTHERS NETWORK',
    description: 'Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.',
    images: ['/3brothers.png'],
  },
};

function mapCmsJobToJobPosition(pos: CmsJobPosition, idx: number): JobPosition {
  const content = pos.published_content ?? pos.content;
  const publishedAt = pos.published_at ? new Date(pos.published_at) : null;
  const postedDaysAgo = publishedAt
    ? Math.floor((Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    id: idx + 1,
    slug: pos.slug,
    title: content.title,
    department: content.department,
    type: content.type,
    location: content.location,
    experience: content.experience,
    salary: content.salary,
    postedDaysAgo,
    shortDescription: content.short_description,
    descriptions: content.descriptions,
    requirements: content.requirements,
    benefits: content.benefits,
  };
}

export default async function CareersPage() {
  const [heroSection, cmsPositions, layout] = await Promise.all([
    getCareersHeroSection(),
    getPublishedJobPositions(),
    resolvePublicLayoutData(),
  ]);

  const hero = heroSection?.published_content ?? heroSection?.content ?? null;
  const positions = cmsPositions.map(mapCmsJobToJobPosition);

  return (
    <CareersView
      hero={hero}
      positions={positions.length > 0 ? positions : undefined}
      header={layout.header}
      footer={layout.footer}
    />
  );
}
