import { resolveSharedContactCtaData } from '@/lib/cms/resolvers/shared-contact-cta.resolver';
import type { SharedContactCtaPayload } from '@/lib/cms/types';
import { ContactCTASectionView } from './ContactCTASectionView';

export async function ContactCTASection() {
  let content: SharedContactCtaPayload | null = null;
  try {
    content = await resolveSharedContactCtaData();
  } catch {
    return null;
  }

  if (!content) return null;
  return <ContactCTASectionView content={content} />;
}
