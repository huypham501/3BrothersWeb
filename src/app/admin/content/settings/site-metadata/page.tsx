import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { globalSiteMetadataSchema } from '@/lib/cms';
import { GlobalSiteMetadataEditor } from '@/components/admin/cms/global-settings/GlobalSiteMetadataEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export default async function GlobalSiteMetadataEditorPage() {
  const actor = await requireAdminUser('/admin/content/settings/site-metadata', 'manage_global_settings');

  const setting = await getGlobalSettingForAdmin<z.infer<typeof globalSiteMetadataSchema>>(SCHEMA_KEYS.GLOBAL_SITE_METADATA);
  if (!setting) notFound();

  return (
    <AdminShell>
      <AdminPageHeader
        title="Edit Site Metadata"
        description="Configure `global.site_metadata.v1` and publish independently."
      />
      <GlobalSiteMetadataEditor
        setting={setting}
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
