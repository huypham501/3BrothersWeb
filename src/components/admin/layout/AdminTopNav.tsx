'use client';

import Link from 'next/link';
import { Button, Space } from 'antd';

export interface AdminNavItem {
  href: string;
  label: string;
}

interface AdminTopNavProps {
  items: AdminNavItem[];
  activeHref?: string;
}

export function AdminTopNav({ items, activeHref }: AdminTopNavProps) {
  return (
    <nav>
      <Space wrap>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button type={activeHref === item.href ? 'primary' : 'default'}>{item.label}</Button>
        </Link>
      ))}
      </Space>
    </nav>
  );
}
