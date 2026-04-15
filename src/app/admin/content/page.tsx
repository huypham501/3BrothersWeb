import Link from 'next/link';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { getRecentCmsAuditLogs } from '@/lib/cms/queries';
import { CmsAuditLogList } from '@/components/admin/cms/audit/CmsAuditLogList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function AdminContentIndexPage() {
  const actor = await requireAdminUser('/admin/content', 'view');
  const recentLogs = await getRecentCmsAuditLogs(10);
  const canManageShared = hasCmsCapability(actor.role, 'manage_shared_sections');
  const canManageGlobal = hasCmsCapability(actor.role, 'manage_global_settings');
  const canEditDraft = hasCmsCapability(actor.role, 'edit_draft');

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Content Admin</h1>
          <p className="text-sm text-muted-foreground">Manage page content and site-wide global settings.</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">Role: {actor.role}</Badge>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/content/audit">Open Audit Log</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Home CMS</CardTitle>
              <CardDescription>Manage Home page local sections and related shared modules.</CardDescription>
            </CardHeader>
            <CardContent>
              {canEditDraft ? (
                <Button asChild>
                  <Link href="/admin/content/pages/home">Open Home Editor</Link>
                </Button>
              ) : (
                <Button disabled>Requires `edit_draft`</Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shared Sections</CardTitle>
              <CardDescription>Manage reusable shared content with usage map and independent publish.</CardDescription>
            </CardHeader>
            <CardContent>
              {canManageShared ? (
                <Button asChild>
                  <Link href="/admin/content/shared">Open Shared Sections</Link>
                </Button>
              ) : (
                <Button disabled>Requires `manage_shared_sections`</Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Creators CMS</CardTitle>
              <CardDescription>Manage For Creators page-level and local section content.</CardDescription>
            </CardHeader>
            <CardContent>
              {canEditDraft ? (
                <Button asChild>
                  <Link href="/admin/content/pages/for-creators">Open For Creators Editor</Link>
                </Button>
              ) : (
                <Button disabled>Requires `edit_draft`</Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>Manage site-wide Header and Footer with independent draft/publish workflow.</CardDescription>
            </CardHeader>
            <CardContent>
              {canManageGlobal ? (
                <Button asChild>
                  <Link href="/admin/content/settings">Open Global Settings</Link>
                </Button>
              ) : (
                <Button disabled>Requires `manage_global_settings`</Button>
              )}
            </CardContent>
          </Card>
        </div>

        <CmsAuditLogList logs={recentLogs} />
      </div>
    </div>
  );
}
