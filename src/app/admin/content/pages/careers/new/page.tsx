import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { JobPositionEditor } from '@/components/admin/cms/editors/JobPositionEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function NewJobPositionPage() {
  const actor = await requireAdminUser('/admin/content/pages/careers/new', 'edit_draft');

  return (
    <AdminShell maxWidth="900px">
      <AdminPageHeader
        title="New Job Position"
        description="Create a new draft job position. Save and publish when ready."
      />
      <JobPositionEditor
        mode="create"
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
