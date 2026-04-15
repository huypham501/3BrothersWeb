import Link from 'next/link';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { getRecentCmsAuditLogs } from '@/lib/cms/queries';
import { CmsAuditLogList } from '@/components/admin/cms/audit/CmsAuditLogList';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function CmsAuditPage() {
  await requireAdminUser('/admin/content/audit', 'view');
  const logs = await getRecentCmsAuditLogs(80);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content">Content Admin</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content/audit">Audit Log</Link>
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">CMS Audit Log</h1>
          <p className="text-sm text-muted-foreground">
            Track draft saves and publish actions across pages, shared sections, and global settings.
          </p>
        </div>

        <CmsAuditLogList logs={logs} />
      </div>
    </div>
  );
}
