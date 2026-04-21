import * as React from 'react';
import { requireAdminUser } from '@/lib/admin/require-admin-user';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireAdminUser('/admin');
  return children;
}
