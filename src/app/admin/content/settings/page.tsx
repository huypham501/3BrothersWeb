import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { getGlobalSettingsForAdmin } from '@/lib/cms/queries';
import { SUPPORTED_GLOBAL_SETTINGS } from '@/lib/cms/constants/global-settings';
import { GlobalSettingsIndex } from '@/components/admin/cms/global-settings/GlobalSettingsIndex';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function GlobalSettingsPage() {
  const actor = await requireAdminUser('/admin/content/settings', 'manage_global_settings');

  const settings = await getGlobalSettingsForAdmin(SUPPORTED_GLOBAL_SETTINGS.map((entry) => entry.schemaKey));

  return (
    <AdminShell>
      <AdminPageHeader
        title="Global Settings"
        description="Site-wide configuration records with independent draft and publish controls."
      />
      <GlobalSettingsIndex settings={settings} role={actor.role} />
    </AdminShell>
  );
}
