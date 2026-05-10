import { resolveSharedContactCtaData } from '@/lib/cms/resolvers/shared-contact-cta.resolver';
import type { SharedContactCtaPayload } from '@/lib/cms/types';
import { ContactCTASectionView } from './ContactCTASectionView';

const DEFAULT_CONTACT_CTA_CONTENT: SharedContactCtaPayload = {
  title: 'GET IN TOUCH',
  subtitle: '',
  cta_label: 'Contact us',
  cta_url: '/',
};

export async function ContactCTASection() {
  const content = await resolveSharedContactCtaData();
  return <ContactCTASectionView content={content ?? DEFAULT_CONTACT_CTA_CONTENT} />;
}
