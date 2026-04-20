'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { getBreadcrumb } from './nav-config';
import type { BreadcrumbSegment } from './nav-config';

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments: BreadcrumbSegment[] = getBreadcrumb(pathname);

  const items = segments.map((seg, i) => {
    const isFirst = i === 0;
    const isLast = i === segments.length - 1;

    const inner = isFirst ? (
      <>
        <HomeOutlined style={{ fontSize: 12, marginRight: 4 }} />
        {seg.label}
      </>
    ) : (
      seg.label
    );

    return {
      key: seg.label,
      title: isLast || !seg.href
        ? <span style={isLast ? styles.current : undefined}>{inner}</span>
        : <Link href={seg.href} style={styles.link}>{inner}</Link>,
    };
  });

  return (
    <div style={styles.wrapper}>
      <Breadcrumb items={items} />
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '14px 0 16px',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: 24,
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  current: {
    color: '#000000d9',
    fontWeight: 500,
  },
} as const;
