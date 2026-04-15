import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { getRecentCmsAuditLogs } from '@/lib/cms/queries';
import { CmsAuditLogList } from '@/components/admin/cms/audit/CmsAuditLogList';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminTopNav } from '@/components/admin/layout/AdminTopNav';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CONTENT_MODULE_NAV } from '@/components/admin/layout/nav-items';

export const dynamic = 'force-dynamic';

export default async function CmsAuditPage() {
  await requireAdminUser('/admin/content/audit', 'view');
  const logs = await getRecentCmsAuditLogs(80);

  return (
    <AdminShell>
      <AdminTopNav items={CONTENT_MODULE_NAV} activeHref="/admin/content/audit" />
      <AdminPageHeader
        title="CMS Audit Log"
        description="Track draft saves and publish actions across pages, shared sections, and global settings."
      />
      <CmsAuditLogList logs={logs} />
    </AdminShell>
  );
}
