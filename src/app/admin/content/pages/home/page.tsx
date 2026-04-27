import * as React from 'react';
import { getHomePageData } from '@/lib/cms/queries';
import { HomePageEditor } from '@/components/admin/cms/HomePageEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';

// We temporarily use a plain render because AdminPageView isn't fully adaptable for this full bleed interface without modifying it, but let's emulate the Admin context.
export const dynamic = 'force-dynamic';

export default async function HomeCmsAdminPage() {
  const [ui, data] = await Promise.all([
    getAdminUiContextFromActor(),
    getHomePageData(),
  ]);

  if (!data) {
    return (
      <AdminContent maxWidth="1000px">
        <AdminPageHeader
          title="Home CMS configuration not found"
          description="Please run the CMS seed script first."
        />
      </AdminContent>
    );
  }

  const typedShared = data.shared as React.ComponentProps<typeof HomePageEditor>['shared'];

  return (
    <AdminContent maxWidth="1000px">
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
    </AdminContent>
  );
}
