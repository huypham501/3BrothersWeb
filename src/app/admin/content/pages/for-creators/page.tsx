import { getForCreatorsPageData } from '@/lib/cms/queries';
import { ForCreatorsPageEditor } from '@/components/admin/cms/ForCreatorsPageEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { getSharedSectionForAdmin } from '@/lib/cms/queries';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { sharedCtaSchema } from '@/lib/cms';
import { z } from 'zod';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.pagesForCreators,
};

export const dynamic = 'force-dynamic';

export default async function ForCreatorsCmsAdminPage() {
  const [ui, data, sharedCta] = await Promise.all([
    getAdminUiContextFromActor(),
    getForCreatorsPageData(),
    getSharedSectionForAdmin<z.infer<typeof sharedCtaSchema>>(SCHEMA_KEYS.SHARED_CTA),
  ]);

  if (!data) {
    return (
      <AdminContent maxWidth="1000px">
        <AdminPageHeader
          title="For Creators CMS configuration not found"
          description="Please run the CMS seed migration for For Creators first."
        />
      </AdminContent>
    );
  }

  const typedGlobals = data.globals as React.ComponentProps<typeof ForCreatorsPageEditor>['globals'];
  const typedShared = {
    ...data.shared,
    cta: sharedCta,
  } as React.ComponentProps<typeof ForCreatorsPageEditor>['shared'];

  return (
    <AdminContent maxWidth="1000px">
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
    </AdminContent>
  );
}
