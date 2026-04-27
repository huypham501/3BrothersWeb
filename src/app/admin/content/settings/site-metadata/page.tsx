import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { globalSiteMetadataSchema } from '@/lib/cms';
import type { CmsGlobalSetting } from '@/lib/cms/types';
import { GlobalSiteMetadataEditor } from '@/components/admin/cms/global-settings/GlobalSiteMetadataEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function GlobalSiteMetadataEditorPage() {
  const [ui, setting] = await Promise.all([
    getAdminUiContextFromActor(),
    getGlobalSettingForAdmin<z.infer<typeof globalSiteMetadataSchema>>(SCHEMA_KEYS.GLOBAL_SITE_METADATA),
  ]);
  const fallbackSetting: CmsGlobalSetting<z.infer<typeof globalSiteMetadataSchema>> = setting ?? {
    id: '',
    schema_key: SCHEMA_KEYS.GLOBAL_SITE_METADATA,
    setting_key: SCHEMA_KEYS.GLOBAL_SITE_METADATA,
    enabled: true,
    content: {
      site_name: '3BROTHERS NETWORK',
      site_url: 'https://3brothers.media',
      default_canonical_base: 'https://3brothers.media',
      brand_name: '3BROTHERS',
      publisher_name: '3BROTHERS NETWORK',
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
        title="Edit Site Metadata"
        description="Configure `global.site_metadata.v1` and publish independently."
      />
      <GlobalSiteMetadataEditor
        setting={fallbackSetting}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
