import type { Metadata } from 'next';
import { AdminRouteLoading } from '@/components/admin/layout/AdminRouteLoading';
import {
  ADMIN_METADATA_PAGE_TITLE_LABELS,
  buildAdminRouteStateTitle,
} from '@/lib/admin/admin-metadata-title-map';

export const metadata: Metadata = {
  title: buildAdminRouteStateTitle(ADMIN_METADATA_PAGE_TITLE_LABELS.contentOverview, 'loading'),
};

export default function AdminContentLoading() {
  return <AdminRouteLoading tip="Loading content..." titleWidth="30%" subtitleWidth="55%" rows={6} />;
}
