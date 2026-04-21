const ADMIN_READ_CACHE_PREFIX = 'cms:admin:read';
const ADMIN_READ_CACHE_TTL_MS = 60_000;

type AdminReadScope =
  | 'shared'
  | 'global'
  | 'audit'
  | 'blogs'
  | 'careers'
  | 'assets';

type CacheEntry<T = unknown> = {
  expiresAt: number;
  value?: T;
  inFlight?: Promise<T>;
};

const cacheStore = new Map<string, CacheEntry>();

function buildCacheKey(scope: AdminReadScope, parts: unknown[]): string {
  return `${ADMIN_READ_CACHE_PREFIX}:${scope}:${JSON.stringify(parts)}`;
}

function buildScopePrefix(scope: AdminReadScope): string {
  return `${ADMIN_READ_CACHE_PREFIX}:${scope}:`;
}

export async function getAdminReadCached<T>(
  scope: AdminReadScope,
  parts: unknown[],
  loader: () => Promise<T>,
  ttlMs = ADMIN_READ_CACHE_TTL_MS
): Promise<T> {
  const key = buildCacheKey(scope, parts);
  const now = Date.now();
  const existing = cacheStore.get(key) as CacheEntry<T> | undefined;

  if (existing?.value !== undefined && existing.expiresAt > now) {
    return existing.value;
  }

  if (existing?.inFlight) {
    return existing.inFlight;
  }

  const inFlight = loader()
    .then((value) => {
      cacheStore.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
      return value;
    })
    .catch((error) => {
      cacheStore.delete(key);
      throw error;
    });

  cacheStore.set(key, {
    ...existing,
    inFlight,
    expiresAt: existing?.expiresAt ?? 0,
  });

  return inFlight;
}

export function invalidateAdminReadScope(scope: AdminReadScope) {
  const prefix = buildScopePrefix(scope);
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}

export function invalidateAllAdminReadCache() {
  cacheStore.clear();
}
