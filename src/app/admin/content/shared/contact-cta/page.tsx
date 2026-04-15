import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getSharedSectionForAdmin } from '@/lib/cms/queries';
import { resolveSharedSectionUsage } from '@/lib/cms/resolvers/shared-usage.resolver';
import { SharedContactCtaManager } from '@/components/admin/cms/shared-sections/SharedContactCtaManager';
import { Button } from '@/components/ui/Button';
import { hasCmsCapability } from '@/lib/cms/constants/roles';

export const dynamic = 'force-dynamic';

export default async function SharedContactCtaPage() {
  const actor = await requireAdminUser('/admin/content/shared/contact-cta', 'manage_shared_sections');

  const section = await getSharedSectionForAdmin(SCHEMA_KEYS.SHARED_CONTACT_CTA);

  if (!section) {
    notFound();
  }

  const usageRoutes = resolveSharedSectionUsage(SCHEMA_KEYS.SHARED_CONTACT_CTA);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content">Content Admin</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content/shared">Shared Sections</Link>
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Edit Contact CTA Shared Section</h1>
          <p className="text-sm text-muted-foreground">
            Configure `shared.contact_cta.v1` and publish independently across affected routes.
          </p>
        </div>

        <SharedContactCtaManager
          section={section}
          usageRoutes={usageRoutes}
          role={actor.role}
          canPublish={hasCmsCapability(actor.role, 'publish')}
        />
      </div>
    </div>
  );
}
