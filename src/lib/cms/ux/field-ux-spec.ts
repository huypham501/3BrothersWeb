export type CmsFieldUxSpec = {
  label?: string;
  what?: string;
  why?: string;
  format?: string;
  validation?: string;
  impact?: string;
  example?: string;
};

type CmsFormUxSpec = Record<string, CmsFieldUxSpec>;

export const CMS_FIELD_UX_SPECS: Record<string, CmsFormUxSpec> = {
  blog_post: {
    is_featured: {
      label: 'Featured Post',
      what: 'Marks this post as eligible for blog highlight hero placement.',
      why: 'Allows editors to curate priority content.',
      impact: 'If multiple posts are featured, the lowest sort order is picked first.',
    },
    'content.id': {
      label: 'Section ID',
      what: 'Internal identifier for this article section.',
      why: 'Used as a stable key/anchor in content rendering.',
      format: 'Lowercase kebab-case.',
      validation: 'Required; max 60 characters.',
      impact: 'Changing after publish may affect existing links.',
      example: 'intro',
    },
    'mid_content.id': {
      label: 'Section ID',
      what: 'Internal identifier for this mid-page section.',
      why: 'Used for stable references in section rendering.',
      format: 'Lowercase kebab-case; unique per post.',
      validation: 'Required; max 60 characters.',
      impact: 'Duplicate IDs can cause unstable anchors.',
      example: 'health',
    },
  },
  home_page_settings: {
    internal_name: {
      label: 'Internal Name',
      what: 'Internal admin-only label for identifying this page config.',
      why: 'Helps editors distinguish pages in CMS lists and audits.',
      format: 'Short human-readable text.',
      validation: 'Max 80 characters.',
      impact: 'Does not render on the public website.',
      example: 'Home - Main',
    },
    status: {
      label: 'Status',
      what: 'Current lifecycle state of this page configuration.',
      why: 'Controls whether this version is eligible to go live.',
      format: 'Choose Draft or Published.',
      validation: 'Must be draft or published.',
      impact: 'Published is served to users; Draft stays internal.',
    },
    canonical_url: {
      label: 'Canonical URL',
      what: 'Preferred canonical URL for this page.',
      why: 'Prevents duplicate URL indexing.',
      format: 'Absolute URL or leave empty.',
      validation: 'Max 1024 characters when provided.',
      impact: 'Overrides default canonical base when provided.',
      example: 'https://3brothers.media/',
    },
  },
  home_trending: {
    news_source: {
      label: 'News Source',
      what: 'Source of content for the Trending section.',
      why: 'Determines whether editors manage cards manually or pull from blog automatically.',
      format: 'Manual Items or Auto Latest Blog Posts.',
      validation: 'Must be manual or auto_latest.',
      impact: 'Auto mode ignores manual news items.',
    },
    news_limit: {
      label: 'Number of Auto-fetched Items',
      what: 'How many latest published blog posts to display.',
      format: 'Positive integer.',
      validation: 'Min 1, max 6.',
      impact: 'Higher numbers show more cards in auto mode.',
      example: '3',
    },
    'news_items.date': {
      label: 'Date string',
      what: 'Display date text shown on the card.',
      why: 'Keeps card metadata consistent when using manual items.',
      format: 'Use one format consistently across items.',
      validation: 'Max 20 characters.',
      example: '12 JAN 2026',
    },
  },
  global_site_metadata: {
    site_url: {
      label: 'Site URL',
      what: 'Main origin of the website.',
      why: 'Used as base context for links and metadata generation.',
      format: 'Absolute URL with protocol.',
      validation: 'Must be a valid URL; max 500 characters.',
      example: 'https://3brothers.media',
    },
    default_canonical_base: {
      label: 'Default Canonical Base',
      what: 'Fallback base used to compose canonical tags.',
      why: 'Ensures canonical URLs exist when page-level canonical is empty.',
      format: 'Absolute URL with protocol.',
      validation: 'Must be a valid URL; max 500 characters.',
      impact: 'Applies only when page canonical URL is not provided.',
    },
  },
  global_seo_defaults: {
    default_robots: {
      label: 'Default Robots',
      what: 'Fallback robots directives for pages without explicit robots config.',
      why: 'Controls whether search engines index and follow links.',
      format: 'Comma-separated directives.',
      validation: 'Max 80 characters.',
      example: 'index,follow',
    },
  },
  for_creators_benefit: {
    'benefits.id': {
      label: 'Benefit Key',
      what: 'System key of this benefit card.',
      why: 'Maps this content to a fixed slot/icon in UI.',
      validation: 'Must be one of: income, brand, management, content.',
      impact: 'Read-only; changing keys requires code/schema updates.',
    },
  },
  for_creators_testimonials: {
    superlabel: {
      label: 'Superlabel',
      what: 'Short text shown above the section title.',
      why: 'Provides context/category before the main heading.',
      format: 'Brief phrase, typically 1-4 words.',
      validation: 'Max 120 characters.',
      example: 'Creators Stories',
    },
  },
};

export function getCmsFieldUxSpec(formId: string, fieldPath: string): CmsFieldUxSpec {
  return CMS_FIELD_UX_SPECS[formId]?.[fieldPath] ?? {};
}
