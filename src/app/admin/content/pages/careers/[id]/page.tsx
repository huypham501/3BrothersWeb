import { notFound } from 'next/navigation';
import { getJobPositionByIdForAdmin } from '@/lib/cms/queries';
import { JobPositionEditor } from '@/components/admin/cms/editors/JobPositionEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContext } from '@/lib/admin/require-admin-user';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditJobPositionPage({ params }: Props) {
  const ui = await getAdminUiContext('/admin/content/pages/careers');
  const { id } = await params;
  const position = await getJobPositionByIdForAdmin(id);

  if (!position) notFound();

  return (
    <AdminShell maxWidth="900px">
      <AdminPageHeader
        title={`Edit: ${position.title}`}
        description={`Slug: /careers/${position.slug}`}
      />
      <JobPositionEditor
        position={position}
        mode="edit"
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminShell>
  );
}
