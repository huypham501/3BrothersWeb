import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { globalSeoDefaultsSchema } from '@/lib/cms';
import { GlobalSeoDefaultsEditor } from '@/components/admin/cms/global-settings/GlobalSeoDefaultsEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminTopNav } from '@/components/admin/layout/AdminTopNav';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { SETTINGS_DETAIL_NAV } from '@/components/admin/layout/nav-items';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function GlobalSeoDefaultsEditorPage() {
  const actor = await requireAdminUser('/admin/content/settings/seo-defaults', 'manage_global_settings');

  const setting = await getGlobalSettingForAdmin<z.infer<typeof globalSeoDefaultsSchema>>(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS);
  if (!setting) notFound();

  return (
    <AdminShell>
      <AdminTopNav items={SETTINGS_DETAIL_NAV} activeHref="/admin/content/settings" />
      <AdminPageHeader
        title="Edit SEO Defaults"
        description="Configure `global.seo_defaults.v1` and publish independently."
      />
      <GlobalSeoDefaultsEditor
        setting={setting}
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
