import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getSharedSectionForAdmin } from '@/lib/cms/queries';
import { resolveSharedSectionUsage } from '@/lib/cms/resolvers/shared-usage.resolver';
import { SharedContactCtaManager } from '@/components/admin/cms/shared-sections/SharedContactCtaManager';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminTopNav } from '@/components/admin/layout/AdminTopNav';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { SHARED_DETAIL_NAV } from '@/components/admin/layout/nav-items';

export const dynamic = 'force-dynamic';

export default async function SharedContactCtaPage() {
  const actor = await requireAdminUser('/admin/content/shared/contact-cta', 'manage_shared_sections');

  const section = await getSharedSectionForAdmin(SCHEMA_KEYS.SHARED_CONTACT_CTA);

  if (!section) {
    notFound();
  }

  const usageRoutes = resolveSharedSectionUsage(SCHEMA_KEYS.SHARED_CONTACT_CTA);

  return (
    <AdminShell>
      <AdminTopNav items={SHARED_DETAIL_NAV} activeHref="/admin/content/shared" />
      <AdminPageHeader
        title="Edit Contact CTA Shared Section"
        description="Configure `shared.contact_cta.v1` and publish independently across affected routes."
      />
      <SharedContactCtaManager
        section={section}
        usageRoutes={usageRoutes}
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
