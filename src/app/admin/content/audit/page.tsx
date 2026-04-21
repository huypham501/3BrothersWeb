import { getRecentCmsAuditLogs } from '@/lib/cms/queries';
import { CmsAuditLogList } from '@/components/admin/cms/audit/CmsAuditLogList';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function CmsAuditPage() {
  const logs = await getRecentCmsAuditLogs(80);

  return (
    <AdminShell>
      <AdminPageHeader
        title="CMS Audit Log"
        description="Track draft saves and publish actions across pages, shared sections, and global settings."
      />
      <CmsAuditLogList logs={logs} />
    </AdminShell>
  );
}
