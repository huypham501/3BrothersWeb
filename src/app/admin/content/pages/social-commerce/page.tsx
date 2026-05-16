import * as React from 'react';
import { getSocialCommercePageData } from '@/lib/cms/queries';
import { SocialCommercePageEditor } from '@/components/admin/cms/SocialCommercePageEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.pagesSocialCommerce,
};

export const dynamic = 'force-dynamic';

export default async function SocialCommerceCmsAdminPage() {
  const [ui, data] = await Promise.all([
    getAdminUiContextFromActor(),
    getSocialCommercePageData(),
  ]);

  if (!data) {
    return (
      <AdminContent maxWidth="1000px">
        <AdminPageHeader
          title="Social Commerce CMS configuration not found"
          description="Please run the CMS migration seed for social-commerce first."
        />
      </AdminContent>
    );
  }

  return (
    <AdminContent maxWidth="1000px">
      <AdminPageHeader
        title="Social Commerce CMS Editor"
        description="Manage the contents and SEO of the Social Commerce Page."
      />
      <SocialCommercePageEditor
        page={data.page}
        sections={data.sections}
        globals={data.globals as React.ComponentProps<typeof SocialCommercePageEditor>['globals']}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
