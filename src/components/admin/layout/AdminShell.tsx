import * as React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminBreadcrumb } from './AdminBreadcrumb';

interface AdminShellProps {
  children: React.ReactNode;
}

interface AdminContentProps {
  children: React.ReactNode;
  /** Max width of the content column. Default: 960px */
  maxWidth?: string;
}

/**
 * Top-level persistent frame for all CMS admin pages.
 *
 * Renders:
 *  - Left sticky sidebar (AdminSidebar) with Ant Design inline Menu
 *  - Right content column with AdminBreadcrumb + page content
 *
 * Server component — AdminSidebar and AdminBreadcrumb are client components
 * that each call usePathname() to derive their active/breadcrumb state.
 */
export function AdminShell({ children }: AdminShellProps) {
  return (
    <div style={styles.root}>
      <AdminSidebar />
      <div style={styles.contentOuter}>
        <AdminBreadcrumb />
        {children}
      </div>
    </div>
  );
}

export function AdminContent({ children, maxWidth = '960px' }: AdminContentProps) {
  return (
    <div style={{ maxWidth, width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {children}
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  contentOuter: {
    flex: 1,
    minWidth: 0,
    padding: '0 28px 48px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: 20,
  },
} as const;
