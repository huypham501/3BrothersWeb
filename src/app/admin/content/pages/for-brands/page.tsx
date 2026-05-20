import * as React from 'react';
import { getForBrandsPageData } from '@/lib/cms/queries';
import { ForBrandsPageEditor } from '@/components/admin/cms/ForBrandsPageEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.pagesForBrands,
};

export const dynamic = 'force-dynamic';

export default async function ForBrandsCmsAdminPage() {
  const [ui, data] = await Promise.all([
    getAdminUiContextFromActor(),
    getForBrandsPageData(),
  ]);

  if (!data) {
    return (
      <AdminContent maxWidth="1000px">
        <AdminPageHeader
          title="For Brands CMS configuration not found"
          description="Please run the CMS migration seed for for-brands first."
        />
      </AdminContent>
    );
  }

  return (
    <AdminContent maxWidth="1000px">
      <AdminPageHeader
        title="For Brands"
        description="Manage local sections and SEO metadata for the For Brands page."
      />
      <ForBrandsPageEditor
        page={data.page}
        sections={data.sections}
        globals={data.globals as React.ComponentProps<typeof ForBrandsPageEditor>['globals']}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
