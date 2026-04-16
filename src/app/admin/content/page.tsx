import Link from 'next/link';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { getRecentCmsAuditLogs } from '@/lib/cms/queries';
import { CmsAuditLogList } from '@/components/admin/cms/audit/CmsAuditLogList';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminTopNav } from '@/components/admin/layout/AdminTopNav';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CONTENT_MODULE_NAV } from '@/components/admin/layout/nav-items';
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
  const actor = await requireAdminUser('/admin/content', 'view');
  const recentLogs = await getRecentCmsAuditLogs(10);
  const canManageShared = hasCmsCapability(actor.role, 'manage_shared_sections');
  const canManageGlobal = hasCmsCapability(actor.role, 'manage_global_settings');
  const canEditDraft = hasCmsCapability(actor.role, 'edit_draft');

  return (
    <AdminShell>
      <AdminTopNav items={CONTENT_MODULE_NAV} activeHref="/admin/content" />
      <AdminPageHeader
        title="Content Admin"
        description="Manage page content and site-wide global settings."
      >
        <AdminBadge>Role: {actor.role}</AdminBadge>
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
              {canEditDraft ? (
                <AdminButton href="/admin/content/pages/home">Open Home Editor</AdminButton>
              ) : (
                <AdminButton disabled>Requires `edit_draft`</AdminButton>
              )}
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Shared Sections</AdminCardTitle>
              <AdminCardDescription>Manage reusable shared content with usage map and independent publish.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              {canManageShared ? (
                <AdminButton href="/admin/content/shared">Open Shared Sections</AdminButton>
              ) : (
                <AdminButton disabled>Requires `manage_shared_sections`</AdminButton>
              )}
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>For Creators CMS</AdminCardTitle>
              <AdminCardDescription>Manage For Creators page-level and local section content.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              {canEditDraft ? (
                <AdminButton href="/admin/content/pages/for-creators">Open For Creators Editor</AdminButton>
              ) : (
                <AdminButton disabled>Requires `edit_draft`</AdminButton>
              )}
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Global Settings</AdminCardTitle>
              <AdminCardDescription>Manage site-wide Header and Footer with independent draft/publish workflow.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              {canManageGlobal ? (
                <AdminButton href="/admin/content/settings">Open Global Settings</AdminButton>
              ) : (
                <AdminButton disabled>Requires `manage_global_settings`</AdminButton>
              )}
            </AdminCardContent>
          </AdminCard>

      </div>

      <CmsAuditLogList logs={recentLogs} />
    </AdminShell>
  );
}

