import { Metadata } from 'next';
import { ContactView } from '@/components/contact/ContactView';
import { resolvePublicLayoutData } from '@/lib/cms/resolvers/public-layout.resolver';

export const metadata: Metadata = {
  title: 'Liên hệ ngay | 3Brothers',
  description: 'Đừng ngần ngại liên hệ ngay để nhận tư vấn. Chúng tôi luôn sẵn sàng hỗ trợ bạn.',
};

export default async function ContactPage() {
  const layout = await resolvePublicLayoutData();

  return <ContactView header={layout.header} footer={layout.footer} />;
}
