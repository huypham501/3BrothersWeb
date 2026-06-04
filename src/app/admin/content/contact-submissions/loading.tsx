import { AdminRouteLoading } from '@/components/admin/layout/AdminRouteLoading';
import {
  ADMIN_METADATA_PAGE_TITLE_LABELS,
  buildAdminRouteStateTitle,
} from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: buildAdminRouteStateTitle(
    ADMIN_METADATA_PAGE_TITLE_LABELS.contactSubmissions,
    'loading'
  ),
};

export default function ContactSubmissionsLoading() {
  return <AdminRouteLoading tip="Loading contact submissions..." titleWidth="30%" subtitleWidth="56%" rows={6} />;
}
