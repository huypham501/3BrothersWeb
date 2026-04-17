import { Metadata } from 'next';
import { SocialCommerceView } from '@/components/socialCommerce/SocialCommerceView';

export const metadata: Metadata = {
  title: 'Social Commerce | 3Brothers',
  description: 'Giải pháp gia tăng thu nhập cho Creator & KOLs. Mở ra các cơ hội monetization mới với Live Commerce, Affiliate Marketing, và mạng lưới đối tác đa dạng.',
};

export default function SocialCommercePage() {
  return <SocialCommerceView />;
}
