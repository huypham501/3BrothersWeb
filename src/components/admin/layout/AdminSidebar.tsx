'use client';

import '@ant-design/v5-patch-for-react-19';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  AuditOutlined,
  CloudUploadOutlined,
  DashboardOutlined,
  EditOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HomeOutlined,
  LayoutOutlined,
  LinkOutlined,
  MenuOutlined,
  PictureOutlined,
  ReadOutlined,
  SearchOutlined,
  SettingOutlined,
  ShareAltOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { CMS_NAV, getActiveKey, getDefaultOpenGroups } from './nav-config';
import type { NavItem, NavLeaf, NavGroup } from './nav-config';

// ─── Icon resolver ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  AuditOutlined: <AuditOutlined />,
  CloudUploadOutlined: <CloudUploadOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  EditOutlined: <EditOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  GlobalOutlined: <GlobalOutlined />,
  HomeOutlined: <HomeOutlined />,
  LayoutOutlined: <LayoutOutlined />,
  LinkOutlined: <LinkOutlined />,
  MenuOutlined: <MenuOutlined />,
  PictureOutlined: <PictureOutlined />,
  ReadOutlined: <ReadOutlined />,
  SearchOutlined: <SearchOutlined />,
  SettingOutlined: <SettingOutlined />,
  ShareAltOutlined: <ShareAltOutlined />,
  TeamOutlined: <TeamOutlined />,
  ToolOutlined: <ToolOutlined />,
};

// ─── Build antd MenuProps['items'] from nav config ───────────────────────────

function buildMenuItems(
  nav: NavItem[],
  onPrefetch: (href: string) => void
): MenuProps['items'] {
  return nav.map((item) => {
    if (item.type === 'leaf') {
      return buildLeaf(item, onPrefetch);
    }
    return buildGroup(item, onPrefetch);
  });
}

function buildLeaf(
  leaf: NavLeaf,
  onPrefetch: (href: string) => void
): NonNullable<MenuProps['items']>[number] {
  return {
    key: leaf.key,
    icon: ICON_MAP[leaf.iconName],
    label: (
      <Link
        href={leaf.href}
        onMouseEnter={() => onPrefetch(leaf.href)}
        onFocus={() => onPrefetch(leaf.href)}
      >
        {leaf.label}
      </Link>
    ),
  };
}

function buildGroup(
  group: NavGroup,
  onPrefetch: (href: string) => void
): NonNullable<MenuProps['items']>[number] {
  return {
    key: group.key,
    icon: ICON_MAP[group.iconName],
    label: group.label,
    children: group.children.map((child) => buildLeaf(child, onPrefetch)),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeKey = getActiveKey(pathname);
  const [openKeys, setOpenKeys] = React.useState<string[]>(
    getDefaultOpenGroups(pathname)
  );
  const menuItems = React.useMemo(
    () =>
      buildMenuItems(CMS_NAV, (href) => {
        router.prefetch(href);
      }),
    [router]
  );

  // Sync open groups when pathname changes (e.g. browser back/forward)
  React.useEffect(() => {
    setOpenKeys((prev) => {
      const required = getDefaultOpenGroups(pathname);
      const merged = Array.from(new Set([...prev, ...required]));
      return merged;
    });
  }, [pathname]);

  return (
    <aside style={styles.sidebar}>
      {/* ── Logo ── */}
      <Link
        href="/admin"
        style={styles.logoLink}
        onMouseEnter={() => router.prefetch('/admin')}
        onFocus={() => router.prefetch('/admin')}
      >
        <div style={styles.logoIcon}>3B</div>
        <div>
          <div style={styles.logoText}>3BROTHERS</div>
          <div style={styles.logoSub}>CMS Admin</div>
        </div>
      </Link>

      {/* ── Ant Design Menu (inline mode) ── */}
      <div style={styles.menuWrapper}>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          items={menuItems}
          style={styles.menu}
        />
      </div>

      {/* ── Asset Manager quick link ── */}
      <div style={styles.footer}>
        <Link
          href="/admin/assets"
          style={styles.footerLink}
          onMouseEnter={() => router.prefetch('/admin/assets')}
          onFocus={() => router.prefetch('/admin/assets')}
        >
          <PictureOutlined style={{ fontSize: 13 }} />
          <span>Asset Manager</span>
        </Link>
      </div>
    </aside>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  sidebar: {
    width: 240,
    flexShrink: 0,
    background: '#fff',
    borderRight: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'sticky' as const,
    top: 0,
    height: '100vh',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
  },
  logo: {
    height: 56,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderBottom: '1px solid #f0f0f0',
    gap: 10,
    flexShrink: 0,
  },
  logoLink: {
    height: 56,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderBottom: '1px solid #f0f0f0',
    gap: 10,
    flexShrink: 0,
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
  },
  logoIcon: {
    width: 30,
    height: 30,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 800,
    fontSize: 12,
    flexShrink: 0,
  },
  logoText: {
    fontWeight: 700,
    fontSize: 13,
    color: '#111',
    lineHeight: 1.3,
  },
  logoSub: {
    fontSize: 11,
    color: '#aaa',
    lineHeight: 1.3,
  },
  menuWrapper: {
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
  },
  menu: {
    borderRight: 0,
    fontSize: 13,
  },
  footer: {
    padding: '10px 16px 14px',
    borderTop: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  footerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 12,
    color: '#8c8c8c',
    textDecoration: 'none',
  },
} as const;
