import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { GlobalFooterEditor } from '@/components/admin/cms/global-settings/GlobalFooterEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminTopNav } from '@/components/admin/layout/AdminTopNav';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { SETTINGS_DETAIL_NAV } from '@/components/admin/layout/nav-items';

export const dynamic = 'force-dynamic';

export default async function GlobalFooterEditorPage() {
  const actor = await requireAdminUser('/admin/content/settings/footer', 'manage_global_settings');

  const setting = await getGlobalSettingForAdmin(SCHEMA_KEYS.GLOBAL_FOOTER);

  if (!setting) {
    notFound();
  }

  return (
    <AdminShell>
      <AdminTopNav items={SETTINGS_DETAIL_NAV} activeHref="/admin/content/settings" />
      <AdminPageHeader
        title="Edit Global Footer"
        description="Configure `global.footer.v1` draft content and publish independently."
      />
      <GlobalFooterEditor
        setting={setting}
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
