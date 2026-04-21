import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  type CmsCapability,
  type CmsRole,
  hasCmsCapability,
  isCmsRole,
} from '@/lib/cms/constants/roles';

export interface CmsActor {
  userId: string;
  email: string;
  role: CmsRole;
}

export interface AdminUiContext {
  actor: CmsActor;
  canPublish: boolean;
  canManageShared: boolean;
  canManageGlobal: boolean;
  canEditDraft: boolean;
}

type CmsActorResolution =
  | { status: 'unauthenticated' }
  | { status: 'forbidden' }
  | { status: 'ok'; actor: CmsActor };

function getCmsRoleFromAppMetadata(appMetadata: unknown): CmsRole | null {
  if (!appMetadata || typeof appMetadata !== 'object') {
    return null;
  }

  const rawRole = (appMetadata as Record<string, unknown>).cms_role;
  if (!isCmsRole(rawRole)) {
    return null;
  }

  return rawRole;
}

async function resolveCmsActorFromJwt(): Promise<CmsActorResolution> {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { status: 'unauthenticated' };
  }

  // Role is injected by Supabase Custom Access Token hook into JWT app_metadata.
  const role = getCmsRoleFromAppMetadata(claimsData.claims.app_metadata);
  const userId =
    typeof claimsData.claims.sub === 'string' ? claimsData.claims.sub : null;
  const email =
    typeof claimsData.claims.email === 'string' ? claimsData.claims.email : null;

  if (!role || !userId) {
    return { status: 'forbidden' };
  }

  return {
    status: 'ok',
    actor: {
      userId,
      email: email ?? 'unknown-user',
      role,
    },
  };
}

export async function requireAdminUser(
  nextPath: string,
  requiredCapability: CmsCapability = 'view'
) {
  const resolved = await resolveCmsActorFromJwt();
  if (resolved.status === 'unauthenticated') {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (resolved.status === 'forbidden') {
    redirect('/forbidden');
  }

  const actor = resolved.actor;
  if (!hasCmsCapability(actor.role, requiredCapability)) {
    redirect('/forbidden');
  }

  return actor;
}

export async function requireCmsActionCapability(
  requiredCapability: CmsCapability
): Promise<CmsActor> {
  const resolved = await resolveCmsActorFromJwt();
  if (resolved.status === 'unauthenticated') {
    throw new Error('Authentication required.');
  }

  if (resolved.status === 'forbidden') {
    throw new Error('You do not have CMS access.');
  }

  const actor = resolved.actor;
  if (!hasCmsCapability(actor.role, requiredCapability)) {
    throw new Error('You do not have permission to perform this action.');
  }

  return actor;
}

export async function getAdminUiContext(
  nextPath = '/admin'
): Promise<AdminUiContext> {
  const actor = await requireAdminUser(nextPath, 'view');

  return {
    actor,
    canPublish: hasCmsCapability(actor.role, 'publish'),
    canManageShared: hasCmsCapability(actor.role, 'manage_shared_sections'),
    canManageGlobal: hasCmsCapability(actor.role, 'manage_global_settings'),
    canEditDraft: hasCmsCapability(actor.role, 'edit_draft'),
  };
}
