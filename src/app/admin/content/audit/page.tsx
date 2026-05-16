import { getRecentCmsAuditLogs } from '@/lib/cms/queries';
import { CmsAuditLogList } from '@/components/admin/cms/audit/CmsAuditLogList';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.auditLog,
};

export const dynamic = 'force-dynamic';

export default async function CmsAuditPage() {
  const logs = await getRecentCmsAuditLogs(80);

  return (
    <AdminContent>
      <AdminPageHeader
        title="CMS Audit Log"
        description="Track draft saves and publish actions across pages, shared sections, and global settings."
      />
      <CmsAuditLogList logs={logs} />
    </AdminContent>
  );
}
