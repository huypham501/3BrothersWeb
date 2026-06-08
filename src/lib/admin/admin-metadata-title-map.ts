export const ADMIN_METADATA_PAGE_TITLE_LABELS = {
  dashboard: 'Admin Dashboard',
  contentOverview: 'CMS Overview',
  contentPagesIndex: 'Page Editors',
  pagesHome: 'Home',
  pagesForCreators: 'For Creators',
  pagesForBrands: 'For Brands',
  pagesSocialCommerce: 'Social Commerce',
  pagesContact: 'Contact',
  blogsList: 'Blogs',
  blogsNew: 'New Blog Post',
  blogsEdit: 'Edit Blog Post',
  careersList: 'Careers',
  careersNew: 'New Job Position',
  careersEdit: 'Edit Job Position',
  sharedIndex: 'Shared Content',
  sharedExclusiveTalents: 'Exclusive Talents',
  sharedContactCta: 'Contact CTA',
  sharedCta: 'Shared CTA',
  settingsIndex: 'Global Settings',
  settingsHeader: 'Header Settings',
  settingsFooter: 'Footer Settings',
  settingsSeoDefaults: 'SEO Defaults',
  settingsSiteMetadata: 'Site Metadata',
  settingsContactPage: 'Contact Page Settings',
  contactSubmissions: 'Contact Submissions',
  contactSubmissionDetail: 'Contact Submission Detail',
  auditLog: 'Audit Log',
  publishCenter: 'Publish Center',
  assetManager: 'Asset Manager',
} as const;

export const ADMIN_METADATA_ROUTE_STATE_SUFFIX = {
  loading: 'Loading',
  error: 'Error',
  notFound: 'Not Found',
} as const;

export type AdminMetadataPageTitleKey = keyof typeof ADMIN_METADATA_PAGE_TITLE_LABELS;
export type AdminMetadataRouteStateKey = keyof typeof ADMIN_METADATA_ROUTE_STATE_SUFFIX;

export function buildAdminRouteStateTitle(pageLabel: string, state: AdminMetadataRouteStateKey) {
  return `${pageLabel} ${ADMIN_METADATA_ROUTE_STATE_SUFFIX[state]}`;
}
