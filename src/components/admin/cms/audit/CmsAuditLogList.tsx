import { CmsAuditLog } from '@/lib/cms';
import {
  AdminBadge,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
  AdminCardTitle,
} from '@/components/admin/layout/AdminPrimitives';

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function CmsAuditLogList({ logs }: { logs: CmsAuditLog[] }) {
  if (!logs.length) {
    return (
      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Recent CMS Activity</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent>
          <p>No audit activity found yet.</p>
        </AdminCardContent>
      </AdminCard>
    );
  }

  return (
    <AdminCard>
      <AdminCardHeader>
        <AdminCardTitle>Recent CMS Activity</AdminCardTitle>
      </AdminCardHeader>
      <AdminCardContent>
        <div>
        {logs.map((log) => (
          <div key={log.id}>
            <div>
              <AdminBadge tone={log.action_type === 'publish' ? 'success' : 'warning'}>
                {log.action_type === 'publish' ? 'Publish' : 'Save Draft'}
              </AdminBadge>
              <AdminBadge>{log.entity_type}</AdminBadge>
              <AdminBadge>{log.entity_key_or_id}</AdminBadge>
            </div>
            <p>{log.summary}</p>
            <p>
              {log.actor_email_or_identifier} ({log.actor_role}) at {formatDate(log.created_at)}
            </p>
          </div>
        ))}
        </div>
      </AdminCardContent>
    </AdminCard>
  );
}
