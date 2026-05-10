import type { CtaPayload } from '@/lib/cms/types';
import { resolveSharedCtaData } from '@/lib/cms/resolvers/shared-cta.resolver';
import { CTASectionView } from './CTASectionView';

export async function CTASection() {
  try {
    const content: CtaPayload | null = await resolveSharedCtaData();
    if (!content) return null;
    return <CTASectionView content={content} />;
  } catch {
    return null;
  }
}
