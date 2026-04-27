import { notFound } from 'next/navigation';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { globalFooterSchema } from '@/lib/cms';
import { GlobalFooterEditor } from '@/components/admin/cms/global-settings/GlobalFooterEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function GlobalFooterEditorPage() {
  const [ui, setting] = await Promise.all([
    getAdminUiContextFromActor(),
    getGlobalSettingForAdmin<z.infer<typeof globalFooterSchema>>(SCHEMA_KEYS.GLOBAL_FOOTER),
  ]);

  if (!setting) {
    notFound();
  }

  return (
    <AdminContent>
      <AdminPageHeader
        title="Edit Global Footer"
        description="Configure `global.footer.v1` draft content and publish independently."
      />
      <GlobalFooterEditor
        setting={setting}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
