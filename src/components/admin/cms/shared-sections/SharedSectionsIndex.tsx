import Link from 'next/link';
import { CmsSharedSection } from '@/lib/cms/types';
import { SUPPORTED_SHARED_SECTIONS, SupportedSharedSchemaKey } from '@/lib/cms/constants/shared-sections';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardDescription,
  AdminCardHeader,
} from '@/components/admin/layout/AdminPrimitives';

interface SharedSectionsIndexProps {
  sections: CmsSharedSection[];
  usageMap: Record<SupportedSharedSchemaKey, string[]>;
  role: string;
}

export function SharedSectionsIndex({ sections, usageMap, role }: SharedSectionsIndexProps) {
  return (
    <div>
      <AdminAlert>
        <AdminAlertTitle>Cross-Page Impact Warning</AdminAlertTitle>
        <AdminAlertDescription>
          Shared sections are reused by multiple routes. Saving keeps changes in draft only; publishing updates every affected route.
        </AdminAlertDescription>
        <p>Your role: {role}</p>
      </AdminAlert>

      <div>
        {SUPPORTED_SHARED_SECTIONS.map((item) => {
          const section = sections.find((entry) => entry.schema_key === item.schemaKey);
          const affectedRoutes = usageMap[item.schemaKey] ?? [];
          const isFound = Boolean(section);

          return (
            <AdminCard key={item.schemaKey}>
              <AdminCardHeader>
                <div>
                  <span>{item.title}</span>
                  {section?.has_unpublished_changes ? (
                    <AdminBadge tone="warning">Has Unpublished Changes</AdminBadge>
                  ) : (
                    <AdminBadge>No Unpublished Changes</AdminBadge>
                  )}
                </div>
                <AdminCardDescription>{item.description}</AdminCardDescription>
              </AdminCardHeader>

              <AdminCardContent>
                <div>
                  <AdminBadge>{item.schemaKey}</AdminBadge>
                  <AdminBadge tone={section?.published_enabled ? 'success' : 'neutral'}>
                    {section?.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                  </AdminBadge>
                  <AdminBadge tone={section?.enabled ? 'info' : 'neutral'}>
                    {section?.enabled ? 'Draft: Enabled' : 'Draft: Disabled'}
                  </AdminBadge>
                  <AdminBadge>{affectedRoutes.length} affected routes</AdminBadge>
                </div>
                <p>
                  Last edited: {section?.last_edited_by_identifier ?? 'N/A'}
                </p>
                <p>
                  Last published: {section?.last_published_by_identifier ?? 'N/A'}
                </p>

                <div>
                  {affectedRoutes.map((route) => (
                    <AdminBadge key={`${item.schemaKey}-${route}`}>
                      {route}
                    </AdminBadge>
                  ))}
                </div>

                {!isFound && (
                  <AdminAlert tone="destructive">
                    <AdminAlertDescription>
                      This shared section record was not found. Seed data may be missing.
                    </AdminAlertDescription>
                  </AdminAlert>
                )}

                {isFound ? (
                  <AdminButton href={item.editorPath}>Edit</AdminButton>
                ) : (
                  <AdminButton disabled>Edit</AdminButton>
                )}
              </AdminCardContent>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
