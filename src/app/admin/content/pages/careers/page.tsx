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
import { getAdminUiContext } from '@/lib/admin/require-admin-user';

export const dynamic = 'force-dynamic';

export default async function CareersAdminPage() {
  const ui = await getAdminUiContext('/admin/content/pages/careers');
  const [positions, heroSection, careersPage] = await Promise.all([
    getAllJobPositionsForAdmin(),
    getCareersHeroSectionForAdmin(),
    getCareersPageForAdmin(),
  ]);

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
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminShell>
  );
}
