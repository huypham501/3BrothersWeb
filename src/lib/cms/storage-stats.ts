'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireCmsActionCapability } from '@/lib/admin/require-admin-user';
import { getAdminReadCached, invalidateAdminReadScope } from './admin-read-cache';

// ─── Types ────────────────────────────────────────────────────────────────────

export type StoragePlan = 'free' | 'pro' | 'team' | 'enterprise' | 'unknown';

export type CmsAssetFile = {
  name: string;
  path: string;         // full path inside the bucket, e.g. "images/abc-photo.jpg"
  publicUrl: string;
  sizeBytes: number;
  mimeType: string | null;
  createdAt: string | null;
};

export type StorageStatsResult = {
  files: CmsAssetFile[];
  usedBytes: number;
  limitBytes: number;
  planName: StoragePlan;
  /** true if PAT env var is missing – falls back to default free-plan limit */
  planFallback: boolean;
  error?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CMS_BUCKET = 'cms-assets';
const IMAGES_FOLDER = 'images';

/** Storage quotas per plan (bytes) – from Supabase docs */
const PLAN_LIMITS_BYTES: Record<StoragePlan, number> = {
  free: 1 * 1024 ** 3,          // 1 GB
  pro: 100 * 1024 ** 3,         // 100 GB
  team: 100 * 1024 ** 3,        // 100 GB
  enterprise: 1024 * 1024 ** 3, // 1 TB (placeholder – shown as "Custom")
  unknown: 1 * 1024 ** 3,       // fallback to free limit
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extracts the Supabase project ref from the project URL.
 * e.g. "https://abcdefgh.supabase.co" → "abcdefgh"
 */
function extractProjectRef(supabaseUrl: string): string {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    return hostname.split('.')[0];
  } catch {
    return '';
  }
}

/**
 * Calls the Supabase Management API to find the subscription plan of the
 * organisation that owns this project.
 *
 * Requires env var: SUPABASE_MANAGEMENT_API_TOKEN
 * (a Personal Access Token from https://supabase.com/dashboard/account/tokens)
 */
async function fetchPlanFromManagementApi(
  projectRef: string
): Promise<{ plan: StoragePlan; fallback: boolean }> {
  const token = process.env.SUPABASE_MANAGEMENT_API_TOKEN;

  if (!token) {
    console.warn(
      '[storage-stats] SUPABASE_MANAGEMENT_API_TOKEN is not set. ' +
        'Falling back to free-plan storage limit.'
    );
    return { plan: 'unknown', fallback: true };
  }

  try {
    // Step 1: Find which org owns this project
    const projectsRes = await fetch('https://api.supabase.com/v1/projects', {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 }, // cache 1 hour – plan rarely changes
    });

    if (!projectsRes.ok) {
      throw new Error(`Management API /projects returned ${projectsRes.status}`);
    }

    const projects: Array<{ id: string; ref: string; organization_id: string }> =
      await projectsRes.json();

    const match = projects.find((p) => p.ref === projectRef);
    if (!match) {
      throw new Error(`Project ref "${projectRef}" not found in Management API response`);
    }

    // Step 2: Get the organisation to read the plan
    const orgRes = await fetch(
      `https://api.supabase.com/v1/organizations/${match.organization_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );

    if (!orgRes.ok) {
      throw new Error(`Management API /organizations returned ${orgRes.status}`);
    }

    const org: { plan: string } = await orgRes.json();
    const planRaw = (org.plan ?? '').toLowerCase();

    const plan: StoragePlan =
      planRaw === 'free' ||
      planRaw === 'pro' ||
      planRaw === 'team' ||
      planRaw === 'enterprise'
        ? (planRaw as StoragePlan)
        : 'unknown';

    return { plan, fallback: false };
  } catch (err) {
    console.error('[storage-stats] Failed to fetch plan from Management API:', err);
    return { plan: 'unknown', fallback: true };
  }
}

// ─── Main exported action ─────────────────────────────────────────────────────

/**
 * Fetches:
 *  - All files in the cms-assets bucket
 *  - Total storage used (sum of file sizes)
 *  - Current Supabase subscription plan + storage limit
 *
 * Requires the CMS admin to be authenticated.
 * Requires env var SUPABASE_MANAGEMENT_API_TOKEN for accurate plan detection.
 */
export async function getCmsStorageStats(): Promise<StorageStatsResult> {
  await requireCmsActionCapability('edit_draft');

  return getAdminReadCached('assets', ['storage-stats'], async () => {
    const supabase = await createSupabaseServerClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const projectRef = extractProjectRef(supabaseUrl);

    // ── 1. Fetch plan info from Management API (server-side, token never exposed) ──
    const { plan: planName, fallback: planFallback } =
      await fetchPlanFromManagementApi(projectRef);

    const limitBytes = PLAN_LIMITS_BYTES[planName];

    // ── 2. List all files in cms-assets/images/ ──────────────────────────────────
    const { data: rawFiles, error: listError } = await supabase.storage
      .from(CMS_BUCKET)
      .list(IMAGES_FOLDER, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (listError) {
      console.error('[storage-stats] Failed to list bucket files:', listError);
      return {
        files: [],
        usedBytes: 0,
        limitBytes,
        planName,
        planFallback,
        error: `Không thể lấy danh sách file: ${listError.message}`,
      };
    }

    // ── 3. Build file list + sum sizes ───────────────────────────────────────────
    const files: CmsAssetFile[] = (rawFiles ?? [])
      .filter((f) => f.name !== '.emptyFolderPlaceholder')
      .map((f) => {
        const path = `${IMAGES_FOLDER}/${f.name}`;
        const { data } = supabase.storage.from(CMS_BUCKET).getPublicUrl(path);
        return {
          name: f.name,
          path,
          publicUrl: data.publicUrl,
          sizeBytes: (f.metadata?.size as number) ?? 0,
          mimeType: (f.metadata?.mimetype as string) ?? null,
          createdAt: f.created_at ?? null,
        };
      });

    const usedBytes = files.reduce((sum, f) => sum + f.sizeBytes, 0);

    return { files, usedBytes, limitBytes, planName, planFallback };
  });
}

// ─── Delete action ────────────────────────────────────────────────────────────

export type DeleteAssetResult = { success: boolean; error?: string };

/**
 * Deletes a single file from the cms-assets bucket by its path.
 * Requires content_admin role or above.
 */
export async function deleteCmsAsset(path: string): Promise<DeleteAssetResult> {
  await requireCmsActionCapability('edit_draft');

  // Security: only allow paths inside the cms-assets bucket images folder
  if (!path.startsWith('images/') || path.includes('..')) {
    return { success: false, error: 'Đường dẫn file không hợp lệ.' };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.storage.from(CMS_BUCKET).remove([path]);

  if (error) {
    console.error('[storage-stats] Failed to delete asset:', error);
    return { success: false, error: `Xóa thất bại: ${error.message}` };
  }

  invalidateAdminReadScope('assets');

  return { success: true };
}
