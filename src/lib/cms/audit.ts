import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CmsRole } from './constants/roles';
import { invalidateAdminReadScope } from './admin-read-cache';

type CmsAuditAction = 'save_draft' | 'publish';
type CmsAuditEntityType = 'page' | 'page_section' | 'shared_section' | 'global_setting' | 'blog_post' | 'job_position';

export interface WriteCmsAuditInput {
  actorUserId: string;
  actorEmail: string;
  actorRole: CmsRole;
  actionType: CmsAuditAction;
  entityType: CmsAuditEntityType;
  entityId?: string | null;
  entityKeyOrId: string;
  pageSlugOrSchemaKey?: string | null;
  summary: string;
}

export async function writeCmsAuditLog(input: WriteCmsAuditInput) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('cms_audit_logs').insert({
    actor_user_id: input.actorUserId,
    actor_email_or_identifier: input.actorEmail,
    actor_role: input.actorRole,
    action_type: input.actionType,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    entity_key_or_id: input.entityKeyOrId,
    page_slug_or_schema_key: input.pageSlugOrSchemaKey ?? null,
    summary: input.summary,
  });

  if (error) {
    console.error('Failed to write CMS audit log', error);
    throw new Error('Failed to write CMS audit log.');
  }

  invalidateAdminReadScope('audit');
}
