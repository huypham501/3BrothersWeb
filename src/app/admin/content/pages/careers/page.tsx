import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import {
  getAllJobPositionsForAdmin,
  getCareersHeroSectionForAdmin,
} from '@/lib/cms/queries';
import { getCareersPageForAdmin } from '@/lib/cms/queries/careers.queries';
import { JobPositionListTable } from '@/components/admin/cms/JobPositionListTable';
import { CareersHeroEditor } from '@/components/admin/cms/editors/CareersHeroEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CareersAdminTabs } from '@/components/admin/cms/CareersAdminTabs';

export const dynamic = 'force-dynamic';

export default async function CareersAdminPage() {
  const actor = await requireAdminUser('/admin/content/pages/careers', 'edit_draft');

  const [positions, heroSection, careersPage] = await Promise.all([
    getAllJobPositionsForAdmin(),
    getCareersHeroSectionForAdmin(),
    getCareersPageForAdmin(),
  ]);

  const canPublish = hasCmsCapability(actor.role, 'publish');

  return (
    <AdminShell maxWidth="1100px">
      <AdminPageHeader
        title="Careers CMS"
        description="Manage the careers page hero section and open job positions."
      />
      <CareersAdminTabs
        heroSection={heroSection}
        careersPageId={careersPage?.id ?? null}
        positions={positions}
        role={actor.role}
        canPublish={canPublish}
      />
    </AdminShell>
  );
}
