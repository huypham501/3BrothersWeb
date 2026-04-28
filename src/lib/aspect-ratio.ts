const ASPECT_RATIO_PATTERN = /^(\d+(\.\d+)?)\s*\/\s*(\d+(\.\d+)?)$/;

export function normalizeAspectRatio(input: string | null | undefined, fallback: string): string {
  const candidate = typeof input === 'string' ? input.trim() : '';
  const match = ASPECT_RATIO_PATTERN.exec(candidate);
  if (!match) return fallback;

  const width = Number.parseFloat(match[1]);
  const height = Number.parseFloat(match[3]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return fallback;
  }

  return `${width} / ${height}`;
}

export function isValidAspectRatio(input: string): boolean {
  const match = ASPECT_RATIO_PATTERN.exec(input.trim());
  if (!match) return false;

  const width = Number.parseFloat(match[1]);
  const height = Number.parseFloat(match[3]);
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
}

