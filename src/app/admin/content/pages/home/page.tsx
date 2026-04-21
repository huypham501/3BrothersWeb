import * as React from 'react';
import { getHomePageData } from '@/lib/cms/queries';
import { HomePageEditor } from '@/components/admin/cms/HomePageEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContext } from '@/lib/admin/require-admin-user';

// We temporarily use a plain render because AdminPageView isn't fully adaptable for this full bleed interface without modifying it, but let's emulate the Admin context.
export const dynamic = 'force-dynamic';

export default async function HomeCmsAdminPage() {
  const ui = await getAdminUiContext('/admin/content/pages/home');
  const data = await getHomePageData();

  if (!data) {
    return (
      <AdminShell maxWidth="1000px">
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
      <AdminPageHeader
        title="Home CMS Editor"
        description="Manage the contents and SEO of the Home Page."
      />
      <HomePageEditor
        page={data.page}
        sections={data.sections}
        shared={typedShared}
        role={ui.actor.role}
        canPublish={ui.canPublish}
        canManageShared={ui.canManageShared}
      />
    </AdminShell>
  );
}
