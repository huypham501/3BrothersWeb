import { AdminPageView } from '@/components/admin/AdminPageView';
import { getAdminUiContext } from '@/lib/admin/require-admin-user';

export default async function AdminPage() {
  const ui = await getAdminUiContext('/admin');
  return <AdminPageView userEmail={ui.actor.email} />;
}
