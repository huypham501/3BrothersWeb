import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getSharedSectionForAdmin } from '@/lib/cms/queries';
import { resolveSharedSectionUsage } from '@/lib/cms/resolvers/shared-usage.resolver';
import { SharedCtaManager } from '@/components/admin/cms/shared-sections/SharedCtaManager';
import { sharedCtaSchema } from '@/lib/cms';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { z } from 'zod';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.sharedCta,
};

export const dynamic = 'force-dynamic';

export default async function SharedCtaPage() {
  const [ui, section] = await Promise.all([
    getAdminUiContextFromActor(),
    getSharedSectionForAdmin<z.infer<typeof sharedCtaSchema>>(SCHEMA_KEYS.SHARED_CTA),
  ]);

  if (!section) {
    return (
      <AdminContent>
        <AdminPageHeader
          title="Shared CTA configuration not found"
          description="Please run the CTA shared-section migration/seed first to create `shared.cta.v1`."
        />
      </AdminContent>
    );
  }

  const usageRoutes = resolveSharedSectionUsage(SCHEMA_KEYS.SHARED_CTA);

  return (
    <AdminContent>
      <AdminPageHeader
        title="CTA Shared Section"
        description="Configure `shared.cta.v1` and publish independently across affected routes."
      />
      <SharedCtaManager
        section={section}
        usageRoutes={usageRoutes}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
