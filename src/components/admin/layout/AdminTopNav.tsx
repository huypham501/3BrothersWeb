'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs } from 'antd';

export interface AdminNavItem {
  href: string;
  label: string;
}

interface AdminTopNavProps {
  items: AdminNavItem[];
}

export function AdminTopNav({ items }: AdminTopNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Tabs
      activeKey={pathname}
      onChange={(key) => router.push(key)}
      items={items.map((item) => ({
        key: item.href,
        label: item.label,
      }))}
    />
  );
}
