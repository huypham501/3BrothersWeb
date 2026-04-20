import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { getSharedSectionForAdmin } from '@/lib/cms/queries';
import { resolveSharedSectionUsage } from '@/lib/cms/resolvers/shared-usage.resolver';
import { SharedExclusiveTalentsManager } from '@/components/admin/cms/shared-sections/SharedExclusiveTalentsManager';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { sharedExclusiveTalentsSchema } from '@/lib/cms';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function SharedExclusiveTalentsPage() {
  const actor = await requireAdminUser('/admin/content/shared/exclusive-talents', 'manage_shared_sections');

  const section = await getSharedSectionForAdmin<z.infer<typeof sharedExclusiveTalentsSchema>>(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS);

  if (!section) {
    notFound();
  }

  const usageRoutes = resolveSharedSectionUsage(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS);

  return (
    <AdminShell>
      <AdminPageHeader
        title="Edit Exclusive Talents Shared Section"
        description="Configure `shared.exclusive_talents.v1` and publish independently across affected routes."
      />
      <SharedExclusiveTalentsManager
        section={section}
        usageRoutes={usageRoutes}
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
