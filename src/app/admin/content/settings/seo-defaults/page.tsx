import { notFound } from 'next/navigation';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { globalSeoDefaultsSchema } from '@/lib/cms';
import { GlobalSeoDefaultsEditor } from '@/components/admin/cms/global-settings/GlobalSeoDefaultsEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContext } from '@/lib/admin/require-admin-user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function GlobalSeoDefaultsEditorPage() {
  const ui = await getAdminUiContext('/admin/content/settings/seo-defaults');
  const setting = await getGlobalSettingForAdmin<z.infer<typeof globalSeoDefaultsSchema>>(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS);
  if (!setting) notFound();

  return (
    <AdminShell>
      <AdminPageHeader
        title="Edit SEO Defaults"
        description="Configure `global.seo_defaults.v1` and publish independently."
      />
      <GlobalSeoDefaultsEditor
        setting={setting}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminShell>
  );
}
