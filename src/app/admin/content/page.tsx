import { getRecentCmsAuditLogs } from '@/lib/cms/queries';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { CmsAuditLogList } from '@/components/admin/cms/audit/CmsAuditLogList';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardDescription,
  AdminCardHeader,
  AdminCardTitle,
} from '@/components/admin/layout/AdminPrimitives';

export const dynamic = 'force-dynamic';

export default async function AdminContentIndexPage() {
  const [ui, recentLogs] = await Promise.all([
    getAdminUiContextFromActor(),
    getRecentCmsAuditLogs(10),
  ]);

  return (
    <AdminContent>
      <AdminPageHeader
        title="Content Admin"
        description="Manage page content and site-wide global settings."
      >
        <AdminBadge>Role: {ui.actor.role}</AdminBadge>
        <AdminButton href="/admin/content/audit" size="sm" variant="outline">
          Open Audit Log
        </AdminButton>
      </AdminPageHeader>

      <div>
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Home CMS</AdminCardTitle>
              <AdminCardDescription>Manage Home page local sections and related shared modules.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <AdminButton href="/admin/content/pages/home">Open Home Editor</AdminButton>
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Shared Sections</AdminCardTitle>
              <AdminCardDescription>Manage reusable shared content with usage map and independent publish.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <AdminButton href="/admin/content/shared">Open Shared Sections</AdminButton>
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>For Creators CMS</AdminCardTitle>
              <AdminCardDescription>Manage For Creators page-level and local section content.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <AdminButton href="/admin/content/pages/for-creators">Open For Creators Editor</AdminButton>
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Global Settings</AdminCardTitle>
              <AdminCardDescription>Manage site-wide Header and Footer with independent draft/publish workflow.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <AdminButton href="/admin/content/settings">Open Global Settings</AdminButton>
            </AdminCardContent>
          </AdminCard>

      </div>

      <CmsAuditLogList logs={recentLogs} />
    </AdminContent>
  );
}
