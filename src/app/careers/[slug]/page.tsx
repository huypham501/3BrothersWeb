import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CareerDetailView } from '@/components/careerDetail/CareerDetailView';
import {
  getPublishedJobPositionBySlug,
  getPublishedJobPositions,
} from '@/lib/cms/queries';
import type { JobPosition } from '@/components/careers/data/jobPositions';
import type { CmsJobPosition } from '@/lib/cms';
import { SITE_URL } from '@/lib/constants';
import { resolvePublicLayoutData } from '@/lib/cms/resolvers/public-layout.resolver';

export const revalidate = false;

interface Props {
  params: Promise<{ slug: string }>;
}

function mapCmsJobToJobPosition(pos: CmsJobPosition, idx = 0): JobPosition {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cmsJob = await getPublishedJobPositionBySlug(slug);
  const content = cmsJob ? (cmsJob.published_content ?? cmsJob.content) : null;

  const title = content
    ? `${content.title} | Tuyển dụng 3BROTHERS MEDIA`
    : 'Tuyển dụng | 3BROTHERS MEDIA';
  const description = content?.short_description
    ?? 'Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.';

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: ['tuyển dụng', 'careers', '3brothers', 'influencer marketing', content?.title ?? ''],
    alternates: { canonical: `${SITE_URL}/careers/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/careers/${slug}`,
      type: 'website',
      images: [{ url: '/3brothers.png', alt: '3BROTHERS MEDIA' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/3brothers.png'],
    },
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params;

  const [cmsJob, allCmsPositions, layout] = await Promise.all([
    getPublishedJobPositionBySlug(slug),
    getPublishedJobPositions(),
    resolvePublicLayoutData(),
  ]);

  if (!cmsJob) notFound();

  const job = mapCmsJobToJobPosition(cmsJob);
  const relatedJobs = allCmsPositions
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p, idx) => mapCmsJobToJobPosition(p, idx));

  return (
    <CareerDetailView
      slug={slug}
      job={job}
      relatedJobs={relatedJobs}
      header={layout.header}
      footer={layout.footer}
      contactCta={layout.contactCta}
    />
  );
}
