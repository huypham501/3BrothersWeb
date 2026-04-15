import { SCHEMA_KEYS } from './schema-keys';

export const SUPPORTED_GLOBAL_SETTINGS = [
  {
    schemaKey: SCHEMA_KEYS.GLOBAL_HEADER,
    title: 'Global Header',
    description: 'Site-wide header navigation and CTA.',
    editorPath: '/admin/content/settings/header',
  },
  {
    schemaKey: SCHEMA_KEYS.GLOBAL_FOOTER,
    title: 'Global Footer',
    description: 'Site-wide footer contact info, menu links, and social links.',
    editorPath: '/admin/content/settings/footer',
  },
  {
    schemaKey: SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS,
    title: 'SEO Defaults',
    description: 'Global metadata defaults used as fallback for CMS-driven pages.',
    editorPath: '/admin/content/settings/seo-defaults',
  },
  {
    schemaKey: SCHEMA_KEYS.GLOBAL_SITE_METADATA,
    title: 'Site Metadata',
    description: 'Site-level metadata identity and canonical base defaults.',
    editorPath: '/admin/content/settings/site-metadata',
  },
] as const;

export type SupportedGlobalSchemaKey = typeof SUPPORTED_GLOBAL_SETTINGS[number]['schemaKey'];
