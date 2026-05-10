import { SCHEMA_KEYS } from '../constants/schema-keys';
import { getSharedSection } from '../queries';
import type { CtaPayload } from '../types';
import {
  resolveSharedContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from './utils/cms-content';

export async function resolveSharedCtaData(): Promise<CtaPayload | null> {
  const sharedCta = await getSharedSection(SCHEMA_KEYS.SHARED_CTA);

  return validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.SHARED_CTA,
    resolveSharedContentBySchemaKey<typeof SCHEMA_KEYS.SHARED_CTA>(sharedCta),
    'public.shared.cta'
  );
}
