'use client';

import * as React from 'react';
import Link from 'next/link';
import { Typography, Tag } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  GlobalOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

export type DependencyKind = 'global' | 'shared';

export interface CmsDependency {
  /** Display name, e.g. "Header" */
  label: string;
  /** Whether the dependency is connected/found */
  connected: boolean;
  /** "global" = Global Settings, "shared" = Shared Content */
  kind: DependencyKind;
  /** Admin route to manage this dependency */
  editHref: string;
}

interface CmsDependenciesCardProps {
  dependencies: CmsDependency[];
  /** Optional section title, defaults to "Dependencies" */
  title?: string;
}

export function CmsDependenciesCard({
  dependencies,
  title = 'Dependencies',
}: CmsDependenciesCardProps) {
  return (
    <div style={styles.wrapper}>
      <Typography.Text strong style={styles.sectionTitle}>
        {title}
      </Typography.Text>
      <Typography.Text type="secondary" style={styles.hint}>
        Các section này được quản lý riêng. Thay đổi ở đây sẽ ảnh hưởng đến tất cả các trang
        sử dụng chúng.
      </Typography.Text>

      <div style={styles.list}>
        {dependencies.map((dep) => (
          <div key={dep.label} style={styles.row}>
            {/* Status icon */}
            <span style={styles.statusIcon}>
              {dep.connected ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <WarningOutlined style={{ color: '#faad14' }} />
              )}
            </span>

            {/* Label + kind badge */}
            <span style={styles.labelGroup}>
              <Typography.Text style={styles.depLabel}>{dep.label}</Typography.Text>
              <Tag
                icon={dep.kind === 'global' ? <GlobalOutlined /> : <ShareAltOutlined />}
                color={dep.kind === 'global' ? 'blue' : 'purple'}
                style={styles.kindTag}
              >
                {dep.kind === 'global' ? 'Global' : 'Shared'}
              </Tag>
            </span>

            {/* Edit link */}
            <Link href={dep.editHref} style={styles.editLink}>
              Chỉnh sửa →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: 8,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    display: 'block' as const,
  },
  hint: {
    fontSize: 12,
    display: 'block' as const,
    marginBottom: 4,
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
    borderTop: '1px solid #f5f5f5',
    paddingTop: 10,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  statusIcon: {
    fontSize: 14,
    flexShrink: 0,
    width: 18,
    display: 'flex',
    alignItems: 'center',
  },
  labelGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  depLabel: {
    fontSize: 13,
  },
  kindTag: {
    margin: 0,
    fontSize: 11,
  },
  editLink: {
    fontSize: 12,
    color: '#7c3aed',
    textDecoration: 'none',
    flexShrink: 0,
  },
} as const;
