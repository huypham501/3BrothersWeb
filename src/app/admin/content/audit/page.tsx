import { Card, Space } from 'antd';
import { getCmsAuditLogList } from '@/lib/cms/queries';
import { CmsAuditLogFilters } from '@/components/admin/cms/audit/CmsAuditLogFilters';
import { CmsAuditLogList } from '@/components/admin/cms/audit/CmsAuditLogList';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';
import { requireAdminUser } from '@/lib/admin/require-admin-user';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.auditLog,
};

export const dynamic = 'force-dynamic';

type CmsAuditPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CmsAuditPage({ searchParams }: CmsAuditPageProps) {
  await requireAdminUser('/admin/content/audit', 'view');
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const result = await getCmsAuditLogList(resolvedSearchParams);

  return (
    <AdminContent maxWidth="1280px">
      <AdminPageHeader
        title="Audit Log"
        description="Track draft saves and publish actions across pages, shared sections, and global settings."
      />
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card>
          <CmsAuditLogFilters params={result.params} />
        </Card>
        <CmsAuditLogList
          logs={result.rows}
          params={result.params}
          total={result.total}
          error={result.error}
        />
      </Space>
    </AdminContent>
  );
}
