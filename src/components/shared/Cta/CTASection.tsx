import type { CtaPayload } from '@/lib/cms/types';
import { resolveSharedCtaData } from '@/lib/cms/resolvers/shared-cta.resolver';
import { CTASectionView } from './CTASectionView';

export async function CTASection() {
  let content: CtaPayload | null = null;
  try {
    content = await resolveSharedCtaData();
  } catch {
    return null;
  }

  if (!content) return null;
  return <CTASectionView content={content} />;
}
