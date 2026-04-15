import { SCHEMA_KEYS } from '../constants/schema-keys';
import type { SupportedSharedSchemaKey } from '../constants/shared-sections';

export const SHARED_SECTION_USAGE_MAP: Record<SupportedSharedSchemaKey, string[]> = {
  [SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS]: ['/', '/for-creators'],
  [SCHEMA_KEYS.SHARED_CONTACT_CTA]: ['/', '/for-creators', '/blogs', '/blogs/[slug]'],
};

export function resolveSharedSectionUsage(schemaKey: SupportedSharedSchemaKey): string[] {
  return SHARED_SECTION_USAGE_MAP[schemaKey] ?? [];
}

export function resolveAllSharedSectionUsage() {
  return SHARED_SECTION_USAGE_MAP;
}
