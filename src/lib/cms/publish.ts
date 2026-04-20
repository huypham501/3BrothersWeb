'use server';

import { revalidatePath } from 'next/cache';
import { requireCmsActionCapability } from '@/lib/admin/require-admin-user';

/**
 * All public routes that display CMS-managed content.
 * Update this list whenever a new public page is added to the site.
 */
const PUBLIC_ROUTES = [
  '/',
  '/for-creators',
  '/blogs',
  '/blogs/[slug]',
  '/careers',
] as const;

export interface PublishResult {
  success: boolean;
  publishedAt: string;
  routesRevalidated: string[];
  error?: string;
}

/**
 * Revalidates the ISR cache for all public-facing routes.
 *
 * Called from the Publish Center. After admin editors are satisfied
 * with their draft changes, they trigger this action once to push
 * the updated content live across all public pages simultaneously.
 */
export async function publishAllContent(): Promise<PublishResult> {
  try {
    await requireCmsActionCapability('publish');
  } catch {
    return {
      success: false,
      publishedAt: new Date().toISOString(),
      routesRevalidated: [],
      error: 'Bạn không có quyền publish nội dung.',
    };
  }

  const routes = [...PUBLIC_ROUTES];

  for (const route of routes) {
    revalidatePath(route);
  }

  return {
    success: true,
    publishedAt: new Date().toISOString(),
    routesRevalidated: routes,
  };
}
