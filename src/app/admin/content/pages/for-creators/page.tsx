import { getForCreatorsPageData } from '@/lib/cms/queries';
import { ForCreatorsPageEditor } from '@/components/admin/cms/ForCreatorsPageEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContext } from '@/lib/admin/require-admin-user';

export const dynamic = 'force-dynamic';

export default async function ForCreatorsCmsAdminPage() {
  const ui = await getAdminUiContext('/admin/content/pages/for-creators');
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
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminShell>
  );
}
