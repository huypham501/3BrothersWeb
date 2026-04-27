import { JobPositionEditor } from '@/components/admin/cms/editors/JobPositionEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';

export const dynamic = 'force-dynamic';

export default async function NewJobPositionPage() {
  const ui = await getAdminUiContextFromActor();

  return (
    <AdminContent maxWidth="900px">
      <AdminPageHeader
        title="New Job Position"
        description="Create a new draft job position. Save and publish when ready."
      />
      <JobPositionEditor
        mode="create"
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
