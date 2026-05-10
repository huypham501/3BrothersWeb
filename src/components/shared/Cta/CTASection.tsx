import type { CtaPayload } from '@/lib/cms/types';
import { resolveSharedCtaData } from '@/lib/cms/resolvers/shared-cta.resolver';
import { CTASectionView } from './CTASectionView';

const DEFAULT_CTA_CONTENT: CtaPayload = {
  heading: 'JOIN OUR CREATOR NETWORK',
  subtitle: '',
  cta_label: 'Join now',
  cta_url: '/contact',
};

export async function CTASection() {
  const content = await resolveSharedCtaData();
  return <CTASectionView content={content ?? DEFAULT_CTA_CONTENT} />;
}
