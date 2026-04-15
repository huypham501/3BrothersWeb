import { CmsAuditLog } from '@/lib/cms';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function CmsAuditLogList({ logs }: { logs: CmsAuditLog[] }) {
  if (!logs.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent CMS Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No audit activity found yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent CMS Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="rounded-md border p-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={log.action_type === 'publish' ? 'default' : 'secondary'}>
                {log.action_type === 'publish' ? 'Publish' : 'Save Draft'}
              </Badge>
              <Badge variant="outline">{log.entity_type}</Badge>
              <Badge variant="outline">{log.entity_key_or_id}</Badge>
            </div>
            <p className="text-sm">{log.summary}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {log.actor_email_or_identifier} ({log.actor_role}) at {formatDate(log.created_at)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
