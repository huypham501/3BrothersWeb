import { notFound } from 'next/navigation';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { globalHeaderSchema } from '@/lib/cms';
import { GlobalHeaderEditor } from '@/components/admin/cms/global-settings/GlobalHeaderEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContext } from '@/lib/admin/require-admin-user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function GlobalHeaderEditorPage() {
  const ui = await getAdminUiContext('/admin/content/settings/header');
  const setting = await getGlobalSettingForAdmin<z.infer<typeof globalHeaderSchema>>(SCHEMA_KEYS.GLOBAL_HEADER);

  if (!setting) {
    notFound();
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Edit Global Header"
        description="Configure `global.header.v1` draft content and publish independently."
      />
      <GlobalHeaderEditor
        setting={setting}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminShell>
  );
}
