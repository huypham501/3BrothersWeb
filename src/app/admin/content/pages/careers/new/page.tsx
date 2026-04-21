import { JobPositionEditor } from '@/components/admin/cms/editors/JobPositionEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContext } from '@/lib/admin/require-admin-user';

export const dynamic = 'force-dynamic';

export default async function NewJobPositionPage() {
  const ui = await getAdminUiContext('/admin/content/pages/careers/new');

  return (
    <AdminShell maxWidth="900px">
      <AdminPageHeader
        title="New Job Position"
        description="Create a new draft job position. Save and publish when ready."
      />
      <JobPositionEditor
        mode="create"
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminShell>
  );
}
