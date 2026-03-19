export function getSafeRedirectPath(path?: string | null, fallback: string = '/admin'): string {
  if (!path) return fallback;
  // Extremely basic validation to prevent open redirects
  if (path.startsWith('/') && !path.startsWith('//')) {
    return path;
  }
  return fallback;
}
