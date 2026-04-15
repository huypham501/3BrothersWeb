import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  CmsCapability,
  CmsRole,
  hasCmsCapability,
  isCmsRole,
} from '@/lib/cms/constants/roles';

export interface CmsActor {
  userId: string;
  email: string;
  role: CmsRole;
}

type CmsActorResolution =
  | { status: 'unauthenticated' }
  | { status: 'forbidden' }
  | { status: 'ok'; actor: CmsActor };

async function resolveCmsActorFromSupabase(): Promise<CmsActorResolution> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { status: 'unauthenticated' };
  }

  const userId = data.user.id;
  const email = data.user.email ?? 'unknown-user';

  const { data: roleRow, error: roleError } = await supabase
    .from('cms_user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (roleError || !isCmsRole(roleRow?.role)) {
    return { status: 'forbidden' };
  }

  return {
    status: 'ok',
    actor: {
      userId,
      email,
      role: roleRow.role,
    },
  };
}

export async function requireAdminUser(
  nextPath: string,
  requiredCapability: CmsCapability = 'view'
) {
  const resolved = await resolveCmsActorFromSupabase();
  if (resolved.status === 'unauthenticated') {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (resolved.status === 'forbidden') {
    redirect('/admin?forbidden=1');
  }

  const actor = resolved.actor;
  if (!hasCmsCapability(actor.role, requiredCapability)) {
    redirect('/admin?forbidden=1');
  }

  return actor;
}

export async function requireCmsActionCapability(requiredCapability: CmsCapability): Promise<CmsActor> {
  const resolved = await resolveCmsActorFromSupabase();
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
