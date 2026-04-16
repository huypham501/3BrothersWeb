import * as React from 'react';
import { getHomePageData } from '@/lib/cms/queries';
import { HomePageEditor } from '@/components/admin/cms/HomePageEditor';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminTopNav } from '@/components/admin/layout/AdminTopNav';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CONTENT_MODULE_NAV } from '@/components/admin/layout/nav-items';

// We temporarily use a plain render because AdminPageView isn't fully adaptable for this full bleed interface without modifying it, but let's emulate the Admin context.
export const dynamic = 'force-dynamic';

export default async function HomeCmsAdminPage() {
  const actor = await requireAdminUser('/admin/content/pages/home', 'edit_draft');
  const data = await getHomePageData();

  if (!data) {
    return (
      <AdminShell maxWidth="1000px">
        <AdminTopNav items={CONTENT_MODULE_NAV} activeHref="/admin/content/pages/home" />
        <AdminPageHeader
          title="Home CMS configuration not found"
          description="Please run the CMS seed script first."
        />
      </AdminShell>
    );
  }

  const typedShared = data.shared as React.ComponentProps<typeof HomePageEditor>['shared'];

  return (
    <AdminShell maxWidth="1000px">
      <AdminTopNav items={CONTENT_MODULE_NAV} activeHref="/admin/content/pages/home" />
      <AdminPageHeader
        title="Home CMS Editor"
        description="Manage the contents and SEO of the Home Page."
      />
      <HomePageEditor
        page={data.page}
        sections={data.sections}
        shared={typedShared}
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
        canManageShared={hasCmsCapability(actor.role, 'manage_shared_sections')}
      />
    </AdminShell>
  );
}
