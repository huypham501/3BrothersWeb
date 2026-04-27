import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { globalSeoDefaultsSchema } from '@/lib/cms';
import type { CmsGlobalSetting } from '@/lib/cms/types';
import { GlobalSeoDefaultsEditor } from '@/components/admin/cms/global-settings/GlobalSeoDefaultsEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function GlobalSeoDefaultsEditorPage() {
  const [ui, setting] = await Promise.all([
    getAdminUiContextFromActor(),
    getGlobalSettingForAdmin<z.infer<typeof globalSeoDefaultsSchema>>(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS),
  ]);
  const fallbackSetting: CmsGlobalSetting<z.infer<typeof globalSeoDefaultsSchema>> = setting ?? {
    id: '',
    schema_key: SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS,
    setting_key: SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS,
    enabled: true,
    content: {
      default_title_template: '{{page_title}} | {{brand_name}}',
      default_meta_description: '',
      default_keywords: [],
      default_og_image: '/3brothers.png',
      default_og_image_alt: '3BROTHERS NETWORK',
      default_twitter_card_type: 'summary_large_image',
      default_robots: 'index,follow',
    },
    published_content: undefined,
    published_enabled: false,
    has_unpublished_changes: false,
    last_edited_by_identifier: null,
    last_edited_at: null,
    last_published_by_identifier: null,
    last_published_at: null,
    created_at: '',
    updated_at: '',
  };

  return (
    <AdminContent>
      <AdminPageHeader
        title="Edit SEO Defaults"
        description="Configure `global.seo_defaults.v1` and publish independently."
      />
      <GlobalSeoDefaultsEditor
        setting={fallbackSetting}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
