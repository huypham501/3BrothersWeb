import Link from 'next/link';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { getGlobalSettingsForAdmin } from '@/lib/cms/queries';
import { SUPPORTED_GLOBAL_SETTINGS } from '@/lib/cms/constants/global-settings';
import { GlobalSettingsIndex } from '@/components/admin/cms/global-settings/GlobalSettingsIndex';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function GlobalSettingsPage() {
  const actor = await requireAdminUser('/admin/content/settings', 'manage_global_settings');

  const settings = await getGlobalSettingsForAdmin(SUPPORTED_GLOBAL_SETTINGS.map((entry) => entry.schemaKey));

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content">Content Admin</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content/pages/home">Home CMS</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content/pages/for-creators">For Creators CMS</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content/shared">Shared Sections</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content/settings">Global Settings</Link>
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Global Settings</h1>
          <p className="text-sm text-muted-foreground">
            Site-wide configuration records with independent draft and publish controls.
          </p>
        </div>

        <GlobalSettingsIndex settings={settings} role={actor.role} />
      </div>
    </div>
  );
}
