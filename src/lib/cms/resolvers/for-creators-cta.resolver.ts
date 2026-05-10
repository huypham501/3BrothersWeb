import { SCHEMA_KEYS } from '../constants/schema-keys';
import { getForCreatorsPageData } from '../queries';
import type { ForCreatorsCtaPayload } from '../types';
import {
  findSectionContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from './utils/cms-content';

export async function resolveForCreatorsCtaData(): Promise<ForCreatorsCtaPayload | null> {
  const data = await getForCreatorsPageData();
  if (!data) return null;

  return validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.FOR_CREATORS_CTA,
    findSectionContentBySchemaKey(data.sections, SCHEMA_KEYS.FOR_CREATORS_CTA),
    'for-creators.sections.cta'
  );
}
