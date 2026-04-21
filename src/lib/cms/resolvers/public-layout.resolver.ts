import { SCHEMA_KEYS } from '../constants/schema-keys';
import { getGlobalSetting } from '../queries';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '../types';
import {
  resolveGlobalContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from './utils/cms-content';

export interface PublicLayoutViewModel {
  header: GlobalHeaderPayload | null;
  footer: GlobalFooterPayload | null;
}

export async function resolvePublicLayoutData(): Promise<PublicLayoutViewModel> {
  const [headerSetting, footerSetting] = await Promise.all([
    getGlobalSetting(SCHEMA_KEYS.GLOBAL_HEADER),
    getGlobalSetting(SCHEMA_KEYS.GLOBAL_FOOTER),
  ]);

  return {
    header: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.GLOBAL_HEADER,
      resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_HEADER>(headerSetting),
      'public.globals.header'
    ),
    footer: validateCmsPayloadBySchemaKey(
      SCHEMA_KEYS.GLOBAL_FOOTER,
      resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_FOOTER>(footerSetting),
      'public.globals.footer'
    ),
  };
}
