import { SCHEMA_KEYS } from '../constants/schema-keys';
import { getSharedSection } from '../queries';
import type { SharedContactCtaPayload } from '../types';
import {
  resolveSharedContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from './utils/cms-content';

export async function resolveSharedContactCtaData(): Promise<SharedContactCtaPayload | null> {
  const sharedContactCta = await getSharedSection(SCHEMA_KEYS.SHARED_CONTACT_CTA);

  return validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.SHARED_CONTACT_CTA,
    resolveSharedContentBySchemaKey<typeof SCHEMA_KEYS.SHARED_CONTACT_CTA>(sharedContactCta),
    'public.shared.contact_cta'
  );
}
