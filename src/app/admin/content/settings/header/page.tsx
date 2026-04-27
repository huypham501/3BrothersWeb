import { notFound } from 'next/navigation';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { globalHeaderSchema } from '@/lib/cms';
import { GlobalHeaderEditor } from '@/components/admin/cms/global-settings/GlobalHeaderEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function GlobalHeaderEditorPage() {
  const [ui, setting] = await Promise.all([
    getAdminUiContextFromActor(),
    getGlobalSettingForAdmin<z.infer<typeof globalHeaderSchema>>(SCHEMA_KEYS.GLOBAL_HEADER),
  ]);

  if (!setting) {
    notFound();
  }

  return (
    <AdminContent>
      <AdminPageHeader
        title="Edit Global Header"
        description="Configure `global.header.v1` draft content and publish independently."
      />
      <GlobalHeaderEditor
        setting={setting}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
