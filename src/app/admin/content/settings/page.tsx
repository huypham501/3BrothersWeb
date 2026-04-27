import { getGlobalSettingsForAdmin } from '@/lib/cms/queries';
import { SUPPORTED_GLOBAL_SETTINGS } from '@/lib/cms/constants/global-settings';
import { GlobalSettingsIndex } from '@/components/admin/cms/global-settings/GlobalSettingsIndex';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';

export const dynamic = 'force-dynamic';

export default async function GlobalSettingsPage() {
  const [ui, settings] = await Promise.all([
    getAdminUiContextFromActor(),
    getGlobalSettingsForAdmin(SUPPORTED_GLOBAL_SETTINGS.map((entry) => entry.schemaKey)),
  ]);

  return (
    <AdminContent>
      <AdminPageHeader
        title="Global Settings"
        description="Site-wide configuration records with independent draft and publish controls."
      />
      <GlobalSettingsIndex settings={settings} role={ui.actor.role} />
    </AdminContent>
  );
}
