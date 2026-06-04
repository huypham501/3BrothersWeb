import { SCHEMA_KEYS, globalContactPageSchema } from '@/lib/cms';
import { getGlobalSetting } from '@/lib/cms/queries';
import { DEFAULT_CONTACT_PAGE_CONFIG } from '@/lib/contact/contact-page-config';
import type { GlobalContactPagePayload } from '@/lib/cms/types';

export async function resolvePublishedContactPageConfig(): Promise<GlobalContactPagePayload | null> {
  const setting = await getGlobalSetting<GlobalContactPagePayload>(SCHEMA_KEYS.GLOBAL_CONTACT_PAGE);

  if (!setting?.published_enabled || !setting.published_content) {
    return null;
  }

  const publishedContent = {
    ...setting.published_content,
    rate_limit_message:
      setting.published_content.rate_limit_message ?? DEFAULT_CONTACT_PAGE_CONFIG.rate_limit_message,
  };

  const parsed = globalContactPageSchema.safeParse(publishedContent);
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}
