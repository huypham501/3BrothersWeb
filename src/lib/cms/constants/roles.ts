export const CMS_ROLES = [
  'super_admin',
  'content_admin',
  'editor',
  'viewer',
] as const;

export type CmsRole = (typeof CMS_ROLES)[number];

export const CMS_CAPABILITIES = [
  'view',
  'edit_draft',
  'publish',
  'manage_global_settings',
  'manage_shared_sections',
] as const;

export type CmsCapability = (typeof CMS_CAPABILITIES)[number];

export const CMS_ROLE_CAPABILITIES: Record<CmsRole, readonly CmsCapability[]> = {
  super_admin: [
    'view',
    'edit_draft',
    'publish',
    'manage_global_settings',
    'manage_shared_sections',
  ],
  content_admin: [
    'view',
    'edit_draft',
    'publish',
    'manage_global_settings',
    'manage_shared_sections',
  ],
  editor: ['view', 'edit_draft'],
  viewer: ['view'],
};

export function isCmsRole(value: unknown): value is CmsRole {
  return typeof value === 'string' && CMS_ROLES.includes(value as CmsRole);
}

export function hasCmsCapability(role: CmsRole, capability: CmsCapability): boolean {
  return CMS_ROLE_CAPABILITIES[role].includes(capability);
}
