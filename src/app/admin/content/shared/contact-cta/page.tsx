import { notFound } from 'next/navigation';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getSharedSectionForAdmin } from '@/lib/cms/queries';
import { resolveSharedSectionUsage } from '@/lib/cms/resolvers/shared-usage.resolver';
import { SharedContactCtaManager } from '@/components/admin/cms/shared-sections/SharedContactCtaManager';
import { sharedContactCtaSchema } from '@/lib/cms';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function SharedContactCtaPage() {
  const [ui, section] = await Promise.all([
    getAdminUiContextFromActor(),
    getSharedSectionForAdmin<z.infer<typeof sharedContactCtaSchema>>(SCHEMA_KEYS.SHARED_CONTACT_CTA),
  ]);

  if (!section) {
    notFound();
  }

  const usageRoutes = resolveSharedSectionUsage(SCHEMA_KEYS.SHARED_CONTACT_CTA);

  return (
    <AdminContent>
      <AdminPageHeader
        title="Edit Contact CTA Shared Section"
        description="Configure `shared.contact_cta.v1` and publish independently across affected routes."
      />
      <SharedContactCtaManager
        section={section}
        usageRoutes={usageRoutes}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
