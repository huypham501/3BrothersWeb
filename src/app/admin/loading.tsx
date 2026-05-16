import type { Metadata } from 'next';
import { AdminRouteLoading } from '@/components/admin/layout/AdminRouteLoading';
import {
  ADMIN_METADATA_PAGE_TITLE_LABELS,
  buildAdminRouteStateTitle,
} from '@/lib/admin/admin-metadata-title-map';

export const metadata: Metadata = {
  title: buildAdminRouteStateTitle(ADMIN_METADATA_PAGE_TITLE_LABELS.dashboard, 'loading'),
};

export default function AdminLoading() {
  return <AdminRouteLoading tip="Loading CMS..." />;
}
