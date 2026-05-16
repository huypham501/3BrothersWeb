import type { Metadata } from 'next';
import { AdminRouteLoading } from '@/components/admin/layout/AdminRouteLoading';
import {
  ADMIN_METADATA_PAGE_TITLE_LABELS,
  buildAdminRouteStateTitle,
} from '@/lib/admin/admin-metadata-title-map';

export const metadata: Metadata = {
  title: buildAdminRouteStateTitle(ADMIN_METADATA_PAGE_TITLE_LABELS.settingsIndex, 'loading'),
};

export default function AdminContentSettingsLoading() {
  return <AdminRouteLoading tip="Loading settings..." titleWidth="28%" subtitleWidth="50%" rows={5} />;
}
