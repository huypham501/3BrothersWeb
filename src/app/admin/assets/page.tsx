import { getCmsStorageStats } from '@/lib/cms/storage-stats';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { AssetManagerClient } from '@/components/admin/assets/AssetManagerClient';
import { StorageUsageBar } from '@/components/admin/assets/StorageUsageBar';
import { AdminAlert, AdminAlertDescription } from '@/components/admin/layout/AdminPrimitives';

export const dynamic = 'force-dynamic';

export default async function AdminAssetsPage() {
  const stats = await getCmsStorageStats();

  return (
    <AdminContent>
      <AdminPageHeader
        title="Asset Manager"
        description="Quản lý ảnh đã upload lên CMS. Theo dõi dung lượng Supabase Storage đang sử dụng."
      />

      {stats.planFallback && (
        <AdminAlert variant="default" style={{ marginBottom: 16, borderColor: '#fcd34d', background: '#fffbeb' }}>
          <AdminAlertDescription>
            <strong>Lưu ý:</strong> Chưa có <code>SUPABASE_MANAGEMENT_API_TOKEN</code> — đang hiển thị giới hạn mặc định (Free plan 1 GB).{' '}
            <a
              href="https://supabase.com/dashboard/account/tokens"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#7c5cff', textDecoration: 'underline' }}
            >
              Xem hướng dẫn tạo token →
            </a>
          </AdminAlertDescription>
        </AdminAlert>
      )}

      {stats.error && (
        <AdminAlert variant="destructive" style={{ marginBottom: 16 }}>
          <AdminAlertDescription>{stats.error}</AdminAlertDescription>
        </AdminAlert>
      )}

      <StorageUsageBar
        usedBytes={stats.usedBytes}
        limitBytes={stats.limitBytes}
        planName={stats.planName}
        fileCount={stats.files.length}
      />

      <AssetManagerClient initialFiles={stats.files} />
    </AdminContent>
  );
}
