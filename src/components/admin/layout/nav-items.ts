import type { AdminNavItem } from './AdminTopNav';

export const CONTENT_MODULE_NAV: AdminNavItem[] = [
  { href: '/admin/content', label: 'Content Admin' },
  { href: '/admin/content/pages/home', label: 'Home CMS' },
  { href: '/admin/content/pages/for-creators', label: 'For Creators CMS' },
  { href: '/admin/content/shared', label: 'Shared Sections' },
  { href: '/admin/content/settings', label: 'Global Settings' },
  { href: '/admin/content/audit', label: 'Audit Log' },
  { href: '/admin/assets', label: '🖼 Asset Manager' },
];

export const SHARED_DETAIL_NAV: AdminNavItem[] = [
  { href: '/admin/content', label: 'Content Admin' },
  { href: '/admin/content/shared', label: 'Shared Sections' },
];

export const SETTINGS_DETAIL_NAV: AdminNavItem[] = [
  { href: '/admin/content', label: 'Content Admin' },
  { href: '/admin/content/settings', label: 'Global Settings' },
];
