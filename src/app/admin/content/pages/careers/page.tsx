import {
  getAllJobPositionsForAdmin,
  getCareersHeroSectionForAdmin,
} from '@/lib/cms/queries';
import { getCareersPageForAdmin } from '@/lib/cms/queries/careers.queries';
import { JobPositionListTable } from '@/components/admin/cms/JobPositionListTable';
import { CareersHeroEditor } from '@/components/admin/cms/editors/CareersHeroEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CareersAdminTabs } from '@/components/admin/cms/CareersAdminTabs';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.careersList,
};

export const dynamic = 'force-dynamic';

export default async function CareersAdminPage() {
  const [ui, positions, heroSection, careersPage] = await Promise.all([
    getAdminUiContextFromActor(),
    getAllJobPositionsForAdmin(),
    getCareersHeroSectionForAdmin(),
    getCareersPageForAdmin(),
  ]);

  return (
    <AdminContent maxWidth="1100px">
      <AdminPageHeader
        title="Careers"
        description="Manage the careers page hero section and open job positions."
      />
      <CareersAdminTabs
        heroSection={heroSection}
        careersPageId={careersPage?.id ?? null}
        positions={positions}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
