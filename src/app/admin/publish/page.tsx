import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { PublishCenterClient } from '@/components/admin/publish/PublishCenterClient';

export const dynamic = 'force-dynamic';

export default async function AdminPublishPage() {
  await requireAdminUser('/admin/publish', 'view');

  return (
    <AdminShell>
      <AdminPageHeader
        title="Publish Center"
        description="Sau khi hoàn tất chỉnh sửa, bấm Publish để cập nhật toàn bộ nội dung lên website."
      />
      <PublishCenterClient />
    </AdminShell>
  );
}
