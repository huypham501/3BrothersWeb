import { Metadata } from 'next';
import { SocialCommerceView } from '@/components/socialCommerce/SocialCommerceView';
import { resolveSocialCommercePageData } from '@/lib/cms/resolvers/social-commerce.resolver';
import { CTASection } from '@/components/shared/Cta/CTASection';

export const metadata: Metadata = {
  title: 'Social Commerce | 3Brothers',
  description: 'Giải pháp gia tăng thu nhập cho Creator & KOLs. Mở ra các cơ hội monetization mới với Live Commerce, Affiliate Marketing, và mạng lưới đối tác đa dạng.',
};

export default async function SocialCommercePage() {
  const data = await resolveSocialCommercePageData();

  return (
    <SocialCommerceView
      data={data}
      ctaSectionSlot={<CTASection />}
    />
  );
}
