import { getForCreatorsPageData } from '@/lib/cms/queries';
import { ForCreatorsPageEditor } from '@/components/admin/cms/ForCreatorsPageEditor';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminTopNav } from '@/components/admin/layout/AdminTopNav';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CONTENT_MODULE_NAV } from '@/components/admin/layout/nav-items';

export const dynamic = 'force-dynamic';

export default async function ForCreatorsCmsAdminPage() {
  const actor = await requireAdminUser('/admin/content/pages/for-creators', 'edit_draft');
  const data = await getForCreatorsPageData();

  if (!data) {
    return (
      <AdminShell maxWidth="1000px">
        <AdminTopNav items={CONTENT_MODULE_NAV} activeHref="/admin/content/pages/for-creators" />
        <AdminPageHeader
          title="For Creators CMS configuration not found"
          description="Please run the CMS seed migration for For Creators first."
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell maxWidth="1000px">
      <AdminTopNav items={CONTENT_MODULE_NAV} activeHref="/admin/content/pages/for-creators" />
      <AdminPageHeader
        title="For Creators CMS Editor"
        description="Manage local sections and SEO metadata for the For Creators page."
      />

      <ForCreatorsPageEditor
        page={data.page}
        sections={data.sections}
        globals={data.globals}
        shared={data.shared}
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
