/**
 * Centralized CMS navigation configuration.
 *
 * Single source of truth for:
 *  - Menu structure (groups + leaves)
 *  - Route → active menu key mapping
 *  - Route → breadcrumb segments mapping
 *
 * To add a new page: add a NavLeaf entry to the appropriate group and
 * add a path entry to PATH_TO_KEY.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavLeaf = {
  type: 'leaf';
  key: string;
  label: string;
  href: string;
  /** @ant-design/icons component name */
  iconName: string;
};

export type NavGroup = {
  type: 'group';
  key: string;
  label: string;
  iconName: string;
  children: NavLeaf[];
};

export type NavItem = NavLeaf | NavGroup;

export type BreadcrumbSegment = {
  label: string;
  href?: string;
};

// ─── Menu tree ────────────────────────────────────────────────────────────────

export const CMS_NAV: NavItem[] = [
  {
    type: 'leaf',
    key: 'overview',
    label: 'CMS Overview',
    href: '/admin/content',
    iconName: 'DashboardOutlined',
  },

  {
    type: 'group',
    key: 'pages',
    label: 'Pages',
    iconName: 'FileTextOutlined',
    children: [
      {
        type: 'leaf',
        key: 'home-cms',
        label: 'Home CMS',
        href: '/admin/content/pages/home',
        iconName: 'HomeOutlined',
      },
      {
        type: 'leaf',
        key: 'for-creators',
        label: 'For Creators CMS',
        href: '/admin/content/pages/for-creators',
        iconName: 'EditOutlined',
      },
    ],
  },

  {
    type: 'group',
    key: 'shared',
    label: 'Shared Content',
    iconName: 'ShareAltOutlined',
    children: [
      {
        type: 'leaf',
        key: 'exclusive-talents',
        label: 'Exclusive Talents',
        href: '/admin/content/shared/exclusive-talents',
        iconName: 'TeamOutlined',
      },
      {
        type: 'leaf',
        key: 'contact-cta',
        label: 'Contact CTA',
        href: '/admin/content/shared/contact-cta',
        iconName: 'LinkOutlined',
      },
    ],
  },

  {
    type: 'group',
    key: 'settings',
    label: 'Global Settings',
    iconName: 'SettingOutlined',
    children: [
      {
        type: 'leaf',
        key: 'settings-header',
        label: 'Header',
        href: '/admin/content/settings/header',
        iconName: 'LayoutOutlined',
      },
      {
        type: 'leaf',
        key: 'settings-footer',
        label: 'Footer',
        href: '/admin/content/settings/footer',
        iconName: 'MenuOutlined',
      },
      {
        type: 'leaf',
        key: 'settings-seo',
        label: 'SEO Defaults',
        href: '/admin/content/settings/seo-defaults',
        iconName: 'SearchOutlined',
      },
      {
        type: 'leaf',
        key: 'settings-metadata',
        label: 'Site Metadata',
        href: '/admin/content/settings/site-metadata',
        iconName: 'GlobalOutlined',
      },
    ],
  },

  {
    type: 'group',
    key: 'tools',
    label: 'Tools',
    iconName: 'ToolOutlined',
    children: [
      {
        type: 'leaf',
        key: 'asset-manager',
        label: 'Asset Manager',
        href: '/admin/assets',
        iconName: 'PictureOutlined',
      },
      {
        type: 'leaf',
        key: 'audit-log',
        label: 'Audit Log',
        href: '/admin/content/audit',
        iconName: 'AuditOutlined',
      },
    ],
  },
];

// ─── Path → nav key mapping ───────────────────────────────────────────────────
// Also covers index/overview pages for groups.

const PATH_TO_KEY: Record<string, string> = {
  '/admin/content': 'overview',
  '/admin/content/pages/home': 'home-cms',
  '/admin/content/pages/for-creators': 'for-creators',
  '/admin/content/shared': 'shared',         // group overview
  '/admin/content/shared/exclusive-talents': 'exclusive-talents',
  '/admin/content/shared/contact-cta': 'contact-cta',
  '/admin/content/settings': 'settings',     // group overview
  '/admin/content/settings/header': 'settings-header',
  '/admin/content/settings/footer': 'settings-footer',
  '/admin/content/settings/seo-defaults': 'settings-seo',
  '/admin/content/settings/site-metadata': 'settings-metadata',
  '/admin/assets': 'asset-manager',
  '/admin/content/audit': 'audit-log',
};

export function getActiveKey(pathname: string): string {
  return PATH_TO_KEY[pathname] ?? 'overview';
}

// ─── Key → open group keys ─────────────────────────────────────────────────────

const KEY_TO_OPEN_GROUPS: Record<string, string[]> = {
  'home-cms': ['pages'],
  'for-creators': ['pages'],
  'shared': ['shared'],
  'exclusive-talents': ['shared'],
  'contact-cta': ['shared'],
  'settings': ['settings'],
  'settings-header': ['settings'],
  'settings-footer': ['settings'],
  'settings-seo': ['settings'],
  'settings-metadata': ['settings'],
  'asset-manager': ['tools'],
  'audit-log': ['tools'],
};

export function getDefaultOpenGroups(pathname: string): string[] {
  const key = getActiveKey(pathname);
  return KEY_TO_OPEN_GROUPS[key] ?? [];
}

// ─── Path → breadcrumb segments ───────────────────────────────────────────────

const ROOT_CRUMB: BreadcrumbSegment = { label: 'CMS Admin', href: '/admin/content' };

const PATH_TO_BREADCRUMB: Record<string, BreadcrumbSegment[]> = {
  '/admin/content': [ROOT_CRUMB],

  // Pages
  '/admin/content/pages/home': [ROOT_CRUMB, { label: 'Pages' }, { label: 'Home CMS' }],
  '/admin/content/pages/for-creators': [ROOT_CRUMB, { label: 'Pages' }, { label: 'For Creators CMS' }],

  // Shared content
  '/admin/content/shared': [ROOT_CRUMB, { label: 'Shared Content' }],
  '/admin/content/shared/exclusive-talents': [ROOT_CRUMB, { label: 'Shared Content' }, { label: 'Exclusive Talents' }],
  '/admin/content/shared/contact-cta': [ROOT_CRUMB, { label: 'Shared Content' }, { label: 'Contact CTA' }],

  // Global settings
  '/admin/content/settings': [ROOT_CRUMB, { label: 'Global Settings' }],
  '/admin/content/settings/header': [ROOT_CRUMB, { label: 'Global Settings' }, { label: 'Header' }],
  '/admin/content/settings/footer': [ROOT_CRUMB, { label: 'Global Settings' }, { label: 'Footer' }],
  '/admin/content/settings/seo-defaults': [ROOT_CRUMB, { label: 'Global Settings' }, { label: 'SEO Defaults' }],
  '/admin/content/settings/site-metadata': [ROOT_CRUMB, { label: 'Global Settings' }, { label: 'Site Metadata' }],

  // Tools
  '/admin/assets': [ROOT_CRUMB, { label: 'Tools' }, { label: 'Asset Manager' }],
  '/admin/content/audit': [ROOT_CRUMB, { label: 'Tools' }, { label: 'Audit Log' }],
};

export function getBreadcrumb(pathname: string): BreadcrumbSegment[] {
  return PATH_TO_BREADCRUMB[pathname] ?? [ROOT_CRUMB];
}
