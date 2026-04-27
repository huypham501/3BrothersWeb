import { getSharedSectionsForAdmin } from '@/lib/cms/queries';
import { SUPPORTED_SHARED_SECTIONS } from '@/lib/cms/constants/shared-sections';
import { resolveAllSharedSectionUsage } from '@/lib/cms/resolvers/shared-usage.resolver';
import { SharedSectionsIndex } from '@/components/admin/cms/shared-sections/SharedSectionsIndex';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';

export const dynamic = 'force-dynamic';

export default async function SharedSectionsPage() {
  const [ui, sections] = await Promise.all([
    getAdminUiContextFromActor(),
    getSharedSectionsForAdmin(SUPPORTED_SHARED_SECTIONS.map((entry) => entry.schemaKey)),
  ]);
  const usageMap = resolveAllSharedSectionUsage();

  return (
    <AdminContent>
      <AdminPageHeader
        title="Shared Sections"
        description="Manage reusable content blocks with independent draft/publish workflow and usage mapping."
      />
      <SharedSectionsIndex
        sections={sections}
        usageMap={usageMap}
        role={ui.actor.role}
      />
    </AdminContent>
  );
}
