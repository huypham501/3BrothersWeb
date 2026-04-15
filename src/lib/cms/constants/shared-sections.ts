import { SCHEMA_KEYS } from './schema-keys';

export const SUPPORTED_SHARED_SECTIONS = [
  {
    schemaKey: SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS,
    title: 'Exclusive Talents',
    description: 'Shared talent spotlight block reused across creator-focused pages.',
    editorPath: '/admin/content/shared/exclusive-talents',
  },
  {
    schemaKey: SCHEMA_KEYS.SHARED_CONTACT_CTA,
    title: 'Contact CTA',
    description: 'Shared contact call-to-action block used on multiple pages.',
    editorPath: '/admin/content/shared/contact-cta',
  },
] as const;

export type SupportedSharedSchemaKey = typeof SUPPORTED_SHARED_SECTIONS[number]['schemaKey'];
