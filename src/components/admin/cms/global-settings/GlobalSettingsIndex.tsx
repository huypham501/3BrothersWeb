import { CmsGlobalSetting } from '@/lib/cms/types';
import { SUPPORTED_GLOBAL_SETTINGS } from '@/lib/cms/constants/global-settings';
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
  AdminCardTitle,
} from '@/components/admin/layout/AdminPrimitives';

interface GlobalSettingsIndexProps {
  settings: CmsGlobalSetting[];
  role: string;
}

export function GlobalSettingsIndex({ settings, role }: GlobalSettingsIndexProps) {
  return (
    <div>
      <AdminAlert>
        <AdminAlertTitle>Global Impact Warning</AdminAlertTitle>
        <AdminAlertDescription>
          Changes to global settings affect multiple public pages and metadata surfaces across the site. Save drafts safely, then publish when ready.
        </AdminAlertDescription>
        <p>Your role: {role}</p>
      </AdminAlert>

      <div>
        {SUPPORTED_GLOBAL_SETTINGS.map((item) => {
          const setting = settings.find((entry) => entry.schema_key === item.schemaKey);
          const isFound = Boolean(setting);

          return (
            <AdminCard key={item.schemaKey}>
              <AdminCardHeader>
                <div>
                  <span>{item.title}</span>
                  {setting?.has_unpublished_changes ? (
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
                  <AdminBadge tone={setting?.published_enabled ? 'success' : 'neutral'}>
                    {setting?.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                  </AdminBadge>
                  <AdminBadge tone={setting?.enabled ? 'info' : 'neutral'}>
                    {setting?.enabled ? 'Draft: Enabled' : 'Draft: Disabled'}
                  </AdminBadge>
                </div>
                <p>
                  Last edited: {setting?.last_edited_by_identifier ?? 'N/A'}
                </p>
                <p>
                  Last published: {setting?.last_published_by_identifier ?? 'N/A'}
                </p>

                {!isFound && (
                  <AdminAlert tone="destructive">
                    <AdminAlertDescription>
                      This global setting record was not found. Seed data may be missing.
                    </AdminAlertDescription>
                  </AdminAlert>
                )}

                <AdminButton href={item.editorPath}>
                  {isFound ? 'Edit' : 'Initialize & Edit'}
                </AdminButton>
              </AdminCardContent>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
