import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { getSharedSectionsForAdmin } from '@/lib/cms/queries';
import { SUPPORTED_SHARED_SECTIONS } from '@/lib/cms/constants/shared-sections';
import { resolveAllSharedSectionUsage } from '@/lib/cms/resolvers/shared-usage.resolver';
import { SharedSectionsIndex } from '@/components/admin/cms/shared-sections/SharedSectionsIndex';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function SharedSectionsPage() {
  const actor = await requireAdminUser('/admin/content/shared', 'manage_shared_sections');

  const sections = await getSharedSectionsForAdmin(SUPPORTED_SHARED_SECTIONS.map((entry) => entry.schemaKey));
  const usageMap = resolveAllSharedSectionUsage();

  return (
    <AdminShell>
      <AdminPageHeader
        title="Shared Sections"
        description="Manage reusable content blocks with independent draft/publish workflow and usage mapping."
      />
      <SharedSectionsIndex sections={sections} usageMap={usageMap} role={actor.role} />
    </AdminShell>
  );
}
