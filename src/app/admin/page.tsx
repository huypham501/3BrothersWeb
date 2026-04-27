import { AdminPageView } from '@/components/admin/AdminPageView';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';

export default async function AdminPage() {
  const ui = await getAdminUiContextFromActor();
  return <AdminPageView userEmail={ui.actor.email} />;
}
