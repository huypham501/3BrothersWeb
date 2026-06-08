import { SCHEMA_KEYS } from '../constants/schema-keys';
import { DEFAULT_BLOG_SOCIAL_SHARE } from '../blog-social-share';
import { getGlobalSetting } from '../queries';
import type { GlobalBlogSocialSharePayload } from '../types';
import {
  resolveGlobalContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from './utils/cms-content';

export async function resolveBlogSocialShareData(): Promise<GlobalBlogSocialSharePayload> {
  const setting = await getGlobalSetting(SCHEMA_KEYS.GLOBAL_BLOG_SOCIAL_SHARE);
  const content = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.GLOBAL_BLOG_SOCIAL_SHARE,
    resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_BLOG_SOCIAL_SHARE>(setting),
    'public.globals.blog_social_share'
  );

  return content ?? DEFAULT_BLOG_SOCIAL_SHARE;
}
