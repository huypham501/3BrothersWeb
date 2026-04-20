import { getForCreatorsPageData } from '@/lib/cms/queries';
import { ForCreatorsPageEditor } from '@/components/admin/cms/ForCreatorsPageEditor';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function ForCreatorsCmsAdminPage() {
  const actor = await requireAdminUser('/admin/content/pages/for-creators', 'edit_draft');
  const data = await getForCreatorsPageData();

  if (!data) {
    return (
      <AdminShell maxWidth="1000px">
        <AdminPageHeader
          title="For Creators CMS configuration not found"
          description="Please run the CMS seed migration for For Creators first."
        />
      </AdminShell>
    );
  }

  const typedGlobals = data.globals as React.ComponentProps<typeof ForCreatorsPageEditor>['globals'];
  const typedShared = data.shared as React.ComponentProps<typeof ForCreatorsPageEditor>['shared'];

  return (
    <AdminShell maxWidth="1000px">
      <AdminPageHeader
        title="For Creators CMS Editor"
        description="Manage local sections and SEO metadata for the For Creators page."
      />

      <ForCreatorsPageEditor
        page={data.page}
        sections={data.sections}
        globals={typedGlobals}
        shared={typedShared}
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
