import type { Metadata } from 'next';
import { CareerDetailView } from '@/components/careerDetail/CareerDetailView';
import { getJobBySlug } from '@/components/careers/data/jobPositions';
import { SITE_URL } from '@/lib/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  const title = job ? `${job.title} | Tuyển dụng 3BROTHERS MEDIA` : 'Tuyển dụng | 3BROTHERS MEDIA';
  const description = job
    ? job.shortDescription
    : 'Gia nhập đội ngũ 3Brothers Media — nơi tài năng sáng tạo gặp cơ hội vượt bậc.';

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: ['tuyển dụng', 'careers', '3brothers', 'influencer marketing', job?.title ?? ''],
    alternates: {
      canonical: `${SITE_URL}/careers/${slug}`,
    },
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
  return <CareerDetailView slug={slug} />;
}
