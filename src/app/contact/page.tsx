import { Metadata } from 'next';
import { ContactView } from '@/components/contact/ContactView';

export const metadata: Metadata = {
  title: 'Liên hệ ngay | 3Brothers',
  description: 'Đừng ngần ngại liên hệ ngay để nhận tư vấn. Chúng tôi luôn sẵn sàng hỗ trợ bạn.',
};

export default function ContactPage() {
  return <ContactView />;
}
