import type { ForCreatorsCtaPayload } from '@/lib/cms/types';
import { resolveForCreatorsCtaData } from '@/lib/cms/resolvers/for-creators-cta.resolver';
import { ForCreatorsCTASectionView } from './ForCreatorsCTASectionView';

const DEFAULT_FOR_CREATORS_CTA_CONTENT: ForCreatorsCtaPayload = {
  heading: 'JOIN OUR CREATOR NETWORK',
  subtitle: '',
  cta_label: 'Join now',
  cta_url: '/contact',
};

export async function ForCreatorsCTASection() {
  const content = await resolveForCreatorsCtaData();
  return <ForCreatorsCTASectionView content={content ?? DEFAULT_FOR_CREATORS_CTA_CONTENT} />;
}
