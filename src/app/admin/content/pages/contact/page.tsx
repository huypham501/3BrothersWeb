import { z } from 'zod';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { globalContactPageSchema } from '@/lib/cms';
import type { CmsGlobalSetting } from '@/lib/cms/types';
import { GlobalContactPageEditor } from '@/components/admin/cms/global-settings/GlobalContactPageEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';
import { DEFAULT_CONTACT_PAGE_CONFIG } from '@/lib/contact/contact-page-config';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.pagesContact,
};

export const dynamic = 'force-dynamic';

export default async function ContactPageCmsAdminPage() {
  const [ui, setting] = await Promise.all([
    getAdminUiContextFromActor(),
    getGlobalSettingForAdmin<z.infer<typeof globalContactPageSchema>>(SCHEMA_KEYS.GLOBAL_CONTACT_PAGE),
  ]);

  const fallbackSetting: CmsGlobalSetting<z.infer<typeof globalContactPageSchema>> = setting ?? {
    id: '',
    schema_key: SCHEMA_KEYS.GLOBAL_CONTACT_PAGE,
    setting_key: SCHEMA_KEYS.GLOBAL_CONTACT_PAGE,
    enabled: true,
    content: DEFAULT_CONTACT_PAGE_CONFIG,
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
        title="Contact"
        description="Manage contact page copy, form behavior, visible fields, required fields, and mail delivery."
      />
      <GlobalContactPageEditor
        setting={fallbackSetting}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
