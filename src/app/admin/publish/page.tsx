import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { PublishCenterClient } from '@/components/admin/publish/PublishCenterClient';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.publishCenter,
};

export const dynamic = 'force-dynamic';

export default async function AdminPublishPage() {
  return (
    <AdminContent>
      <AdminPageHeader
        title="Publish Center"
        description="Sau khi hoàn tất chỉnh sửa, bấm Publish để cập nhật toàn bộ nội dung lên website."
      />
      <PublishCenterClient />
    </AdminContent>
  );
}
