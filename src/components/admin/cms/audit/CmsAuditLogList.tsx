import styled from 'styled-components';
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
          <MetaText>No audit activity found yet.</MetaText>
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
        <Rows>
        {logs.map((log) => (
          <Row key={log.id}>
            <TopRow>
              <AdminBadge tone={log.action_type === 'publish' ? 'success' : 'warning'}>
                {log.action_type === 'publish' ? 'Publish' : 'Save Draft'}
              </AdminBadge>
              <AdminBadge>{log.entity_type}</AdminBadge>
              <AdminBadge>{log.entity_key_or_id}</AdminBadge>
            </TopRow>
            <Summary>{log.summary}</Summary>
            <MetaText>
              {log.actor_email_or_identifier} ({log.actor_role}) at {formatDate(log.created_at)}
            </MetaText>
          </Row>
        ))}
        </Rows>
      </AdminCardContent>
    </AdminCard>
  );
}

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
`;

const TopRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const Summary = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #0f172a;
`;

const MetaText = styled.p`
  margin: 6px 0 0;
  font-size: 0.75rem;
  color: #64748b;
`;
