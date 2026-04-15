import Link from 'next/link';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { getSharedSectionsForAdmin } from '@/lib/cms/queries';
import { SUPPORTED_SHARED_SECTIONS } from '@/lib/cms/constants/shared-sections';
import { resolveAllSharedSectionUsage } from '@/lib/cms/resolvers/shared-usage.resolver';
import { SharedSectionsIndex } from '@/components/admin/cms/shared-sections/SharedSectionsIndex';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function SharedSectionsPage() {
  const actor = await requireAdminUser('/admin/content/shared', 'manage_shared_sections');

  const sections = await getSharedSectionsForAdmin(SUPPORTED_SHARED_SECTIONS.map((entry) => entry.schemaKey));
  const usageMap = resolveAllSharedSectionUsage();

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
          <h1 className="text-2xl font-semibold">Shared Sections</h1>
          <p className="text-sm text-muted-foreground">
            Manage reusable content blocks with independent draft/publish workflow and usage mapping.
          </p>
        </div>

        <SharedSectionsIndex sections={sections} usageMap={usageMap} role={actor.role} />
      </div>
    </div>
  );
}
