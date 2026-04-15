import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { GlobalSeoDefaultsEditor } from '@/components/admin/cms/global-settings/GlobalSeoDefaultsEditor';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function GlobalSeoDefaultsEditorPage() {
  const actor = await requireAdminUser('/admin/content/settings/seo-defaults', 'manage_global_settings');

  const setting = await getGlobalSettingForAdmin(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS);
  if (!setting) notFound();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm"><Link href="/admin/content">Content Admin</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/admin/content/settings">Global Settings</Link></Button>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Edit SEO Defaults</h1>
          <p className="text-sm text-muted-foreground">Configure `global.seo_defaults.v1` and publish independently.</p>
        </div>

        <GlobalSeoDefaultsEditor
          setting={setting}
          role={actor.role}
          canPublish={hasCmsCapability(actor.role, 'publish')}
        />
      </div>
    </div>
  );
}
