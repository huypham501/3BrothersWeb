/**
 * Shared CMS utility helpers.
 * Import từ file này thay vì định nghĩa cục bộ trong từng component.
 */

/**
 * Format audit timestamp theo vi-VN locale.
 * Dùng chung cho CmsEditorStatusBar, SharedContactCtaManager, SharedExclusiveTalentsManager.
 * Trả về '—' nếu không có giá trị.
 */
export function fmtAuditDate(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
