import * as React from 'react';
import { getHomePageData, getPublishedBlogPosts } from '@/lib/cms/queries';
import { HomePageEditor } from '@/components/admin/cms/HomePageEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

// We temporarily use a plain render because AdminPageView isn't fully adaptable for this full bleed interface without modifying it, but let's emulate the Admin context.
export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.pagesHome,
};

export const dynamic = 'force-dynamic';

export default async function HomeCmsAdminPage() {
  const [ui, data, publishedBlogPosts] = await Promise.all([
    getAdminUiContextFromActor(),
    getHomePageData(),
    getPublishedBlogPosts(),
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
        publishedBlogPosts={publishedBlogPosts}
        shared={typedShared}
        role={ui.actor.role}
        canPublish={ui.canPublish}
        canManageShared={ui.canManageShared}
      />
    </AdminContent>
  );
}
