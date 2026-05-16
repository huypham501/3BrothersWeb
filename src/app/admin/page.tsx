import { AdminPageView } from '@/components/admin/AdminPageView';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.dashboard,
};

export default async function AdminPage() {
  const ui = await getAdminUiContextFromActor();
  return <AdminPageView userEmail={ui.actor.email} />;
}
