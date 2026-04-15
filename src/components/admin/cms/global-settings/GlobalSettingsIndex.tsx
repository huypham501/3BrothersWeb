import Link from 'next/link';
import { CmsGlobalSetting } from '@/lib/cms/types';
import { SUPPORTED_GLOBAL_SETTINGS } from '@/lib/cms/constants/global-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GlobalSettingsIndexProps {
  settings: CmsGlobalSetting[];
  role: string;
}

export function GlobalSettingsIndex({ settings, role }: GlobalSettingsIndexProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Global Impact Warning</AlertTitle>
        <AlertDescription>
          Changes to global settings affect multiple public pages and metadata surfaces across the site. Save drafts safely, then publish when ready.
        </AlertDescription>
        <p className="mt-2 text-xs text-muted-foreground">Your role: {role}</p>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        {SUPPORTED_GLOBAL_SETTINGS.map((item) => {
          const setting = settings.find((entry) => entry.schema_key === item.schemaKey);
          const isFound = Boolean(setting);

          return (
            <Card key={item.schemaKey}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span>{item.title}</span>
                  {setting?.has_unpublished_changes ? (
                    <Badge variant="secondary">Has Unpublished Changes</Badge>
                  ) : (
                    <Badge variant="outline">No Unpublished Changes</Badge>
                  )}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{item.schemaKey}</Badge>
                  <Badge variant={setting?.published_enabled ? 'default' : 'outline'}>
                    {setting?.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                  </Badge>
                  <Badge variant={setting?.enabled ? 'default' : 'outline'}>
                    {setting?.enabled ? 'Draft: Enabled' : 'Draft: Disabled'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last edited: {setting?.last_edited_by_identifier ?? 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last published: {setting?.last_published_by_identifier ?? 'N/A'}
                </p>

                {!isFound && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      This global setting record was not found. Seed data may be missing.
                    </AlertDescription>
                  </Alert>
                )}

                {isFound ? (
                  <Button asChild>
                    <Link href={item.editorPath}>Edit</Link>
                  </Button>
                ) : (
                  <Button disabled>Edit</Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
