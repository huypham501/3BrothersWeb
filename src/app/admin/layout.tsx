import * as React from 'react';
import type { Metadata } from 'next';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { AdminShell } from '@/components/admin/layout/AdminShell';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: 'CMS Admin',
    template: '%s | CMS Admin',
  },
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireAdminUser('/admin');
  return <AdminShell>{children}</AdminShell>;
}
