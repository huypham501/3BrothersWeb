import { Metadata } from 'next';
import { ContactView } from '@/components/contact/ContactView';
import { resolvePublicLayoutData } from '@/lib/cms/resolvers/public-layout.resolver';
import { resolvePublishedContactPageConfig } from '@/lib/cms/resolvers/contact-page.resolver';

export const metadata: Metadata = {
  title: 'Liên hệ ngay | 3Brothers',
  description: 'Đừng ngần ngại liên hệ ngay để nhận tư vấn. Chúng tôi luôn sẵn sàng hỗ trợ bạn.',
};

export default async function ContactPage() {
  const [layout, contactPage] = await Promise.all([
    resolvePublicLayoutData(),
    resolvePublishedContactPageConfig(),
  ]);

  return <ContactView header={layout.header} footer={layout.footer} contactPage={contactPage} />;
}
