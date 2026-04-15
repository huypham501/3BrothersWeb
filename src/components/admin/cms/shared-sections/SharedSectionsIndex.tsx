import Link from 'next/link';
import { CmsSharedSection } from '@/lib/cms/types';
import { SUPPORTED_SHARED_SECTIONS, SupportedSharedSchemaKey } from '@/lib/cms/constants/shared-sections';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SharedSectionsIndexProps {
  sections: CmsSharedSection[];
  usageMap: Record<SupportedSharedSchemaKey, string[]>;
  role: string;
}

export function SharedSectionsIndex({ sections, usageMap, role }: SharedSectionsIndexProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Cross-Page Impact Warning</AlertTitle>
        <AlertDescription>
          Shared sections are reused by multiple routes. Saving keeps changes in draft only; publishing updates every affected route.
        </AlertDescription>
        <p className="mt-2 text-xs text-muted-foreground">Your role: {role}</p>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        {SUPPORTED_SHARED_SECTIONS.map((item) => {
          const section = sections.find((entry) => entry.schema_key === item.schemaKey);
          const affectedRoutes = usageMap[item.schemaKey] ?? [];
          const isFound = Boolean(section);

          return (
            <Card key={item.schemaKey}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span>{item.title}</span>
                  {section?.has_unpublished_changes ? (
                    <Badge variant="secondary">Has Unpublished Changes</Badge>
                  ) : (
                    <Badge variant="outline">No Unpublished Changes</Badge>
                  )}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{item.schemaKey}</Badge>
                  <Badge variant={section?.published_enabled ? 'default' : 'outline'}>
                    {section?.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                  </Badge>
                  <Badge variant={section?.enabled ? 'default' : 'outline'}>
                    {section?.enabled ? 'Draft: Enabled' : 'Draft: Disabled'}
                  </Badge>
                  <Badge variant="outline">{affectedRoutes.length} affected routes</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last edited: {section?.last_edited_by_identifier ?? 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last published: {section?.last_published_by_identifier ?? 'N/A'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {affectedRoutes.map((route) => (
                    <Badge key={`${item.schemaKey}-${route}`} variant="outline">
                      {route}
                    </Badge>
                  ))}
                </div>

                {!isFound && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      This shared section record was not found. Seed data may be missing.
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
