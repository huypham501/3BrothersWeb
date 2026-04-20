import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { getJobPositionByIdForAdmin } from '@/lib/cms/queries';
import { JobPositionEditor } from '@/components/admin/cms/editors/JobPositionEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditJobPositionPage({ params }: Props) {
  const { id } = await params;
  const actor = await requireAdminUser(
    `/admin/content/pages/careers/${id}`,
    'edit_draft'
  );
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
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
