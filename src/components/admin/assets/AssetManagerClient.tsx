'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { CmsAssetFile } from '@/lib/cms/storage-stats';
import { deleteCmsAsset } from '@/lib/cms/storage-stats';

type Props = {
  initialFiles: CmsAssetFile[];
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function AssetManagerClient({ initialFiles }: Props) {
  const router = useRouter();
  const [files, setFiles] = React.useState<CmsAssetFile[]>(initialFiles);
  const [search, setSearch] = React.useState('');
  const [confirmDelete, setConfirmDelete] = React.useState<CmsAssetFile | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);
  const [lightbox, setLightbox] = React.useState<CmsAssetFile | null>(null);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteCmsAsset(confirmDelete.path);
      if (!result.success) {
        setDeleteError(result.error ?? 'Xóa thất bại.');
      } else {
        setFiles((prev) => prev.filter((f) => f.path !== confirmDelete.path));
        setConfirmDelete(null);
        router.refresh();
      }
    } catch {
      setDeleteError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* ── Search bar ── */}
      <div style={styles.toolbar}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên file..."
          style={styles.searchInput}
        />
        <span style={styles.count}>{filtered.length} file</span>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyText}>
            {search ? `Không tìm thấy file nào khớp với "${search}".` : 'Chưa có file nào được upload.'}
          </p>
        </div>
      )}

      {/* ── Asset grid ── */}
      <div style={styles.grid}>
        {filtered.map((file) => (
          <div key={file.path} style={styles.card}>
            {/* Thumbnail */}
            <div
              style={styles.thumb}
              onClick={() => setLightbox(file)}
              title="Xem ảnh đầy đủ"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.publicUrl}
                alt={file.name}
                style={styles.thumbImg}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div style={styles.thumbOverlay}>
                <span style={styles.thumbZoom}>🔍</span>
              </div>
            </div>

            {/* Info */}
            <div style={styles.info}>
              <p style={styles.filename} title={file.name}>
                {file.name}
              </p>
              <p style={styles.meta}>
                {formatBytes(file.sizeBytes)} · {formatDate(file.createdAt)}
              </p>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                style={styles.btnCopy}
                onClick={() => handleCopy(file.publicUrl)}
                title="Copy URL"
              >
                {copiedUrl === file.publicUrl ? '✓ Copied' : '📋 Copy URL'}
              </button>
              <button
                style={styles.btnDelete}
                onClick={() => {
                  setDeleteError(null);
                  setConfirmDelete(file);
                }}
                title="Xóa file"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Delete confirm modal ── */}
      {confirmDelete && (
        <div style={styles.backdrop} onClick={() => !deleting && setConfirmDelete(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Xác nhận xóa</h3>
            <p style={styles.modalBody}>
              Bạn có chắc muốn xóa file{' '}
              <strong>{confirmDelete.name}</strong>?<br />
              <span style={styles.modalWarn}>
                Hành động này không thể hoàn tác. Nếu ảnh đang được dùng trong CMS,
                nó sẽ bị hỏng link.
              </span>
            </p>
            {deleteError && (
              <p style={styles.deleteError}>{deleteError}</p>
            )}
            <div style={styles.modalActions}>
              <button
                style={styles.btnCancel}
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                style={{
                  ...styles.btnConfirmDelete,
                  opacity: deleting ? 0.6 : 1,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          style={styles.backdrop}
          onClick={() => setLightbox(null)}
        >
          <div style={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.lightboxClose}
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.publicUrl}
              alt={lightbox.name}
              style={styles.lightboxImg}
            />
            <div style={styles.lightboxMeta}>
              <span>{lightbox.name}</span>
              <span>{formatBytes(lightbox.sizeBytes)}</span>
              <button
                style={styles.btnCopyLightbox}
                onClick={() => handleCopy(lightbox.publicUrl)}
              >
                {copiedUrl === lightbox.publicUrl ? '✓ Copied' : '📋 Copy URL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  searchInput: {
    flex: 1,
    height: '36px',
    padding: '0 12px',
    fontSize: '14px',
    border: '1px solid #d9d9d9',
    borderRadius: '8px',
    background: '#fff',
    outline: 'none',
    maxWidth: '360px',
  },
  count: {
    fontSize: '13px',
    color: '#888',
  },
  empty: {
    padding: '48px 0',
    textAlign: 'center' as const,
  },
  emptyText: {
    color: '#aaa',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  thumb: {
    position: 'relative' as const,
    height: '140px',
    background: '#f9fafb',
    cursor: 'pointer',
    overflow: 'hidden' as const,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
    padding: '8px',
    boxSizing: 'border-box' as const,
  },
  thumbOverlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  thumbZoom: {
    fontSize: '22px',
  },
  info: {
    padding: '8px 10px 4px',
  },
  filename: {
    margin: '0 0 2px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#222',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
  },
  meta: {
    margin: 0,
    fontSize: '11px',
    color: '#aaa',
  },
  actions: {
    padding: '8px 10px',
    display: 'flex',
    gap: '6px',
    borderTop: '1px solid #f3f4f6',
    marginTop: 'auto' as const,
  },
  btnCopy: {
    flex: 1,
    height: '28px',
    fontSize: '11px',
    fontWeight: 500,
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    background: '#fff',
    cursor: 'pointer',
    color: '#555',
  },
  btnDelete: {
    height: '28px',
    width: '32px',
    fontSize: '14px',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    background: '#fff5f5',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal
  backdrop: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px 28px',
    maxWidth: '420px',
    width: '90%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    margin: '0 0 12px',
    fontSize: '16px',
    fontWeight: 700,
    color: '#111',
  },
  modalBody: {
    fontSize: '14px',
    color: '#444',
    lineHeight: 1.6,
    margin: '0 0 16px',
  },
  modalWarn: {
    color: '#dc2626',
    fontSize: '13px',
  },
  deleteError: {
    margin: '0 0 12px',
    fontSize: '13px',
    color: '#dc2626',
    background: '#fee2e2',
    padding: '8px 12px',
    borderRadius: '6px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  btnCancel: {
    height: '34px',
    padding: '0 16px',
    fontSize: '13px',
    fontWeight: 500,
    border: '1px solid #d9d9d9',
    borderRadius: '7px',
    background: '#fff',
    cursor: 'pointer',
    color: '#555',
  },
  btnConfirmDelete: {
    height: '34px',
    padding: '0 16px',
    fontSize: '13px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '7px',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
  },
  // Lightbox
  lightboxInner: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden' as const,
    maxWidth: '90vw',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    position: 'relative' as const,
  },
  lightboxClose: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  lightboxImg: {
    maxWidth: '80vw',
    maxHeight: '75vh',
    objectFit: 'contain' as const,
    display: 'block',
  },
  lightboxMeta: {
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: '#666',
    borderTop: '1px solid #f3f4f6',
  },
  btnCopyLightbox: {
    marginLeft: 'auto' as const,
    height: '28px',
    padding: '0 12px',
    fontSize: '12px',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    background: '#fff',
    cursor: 'pointer',
  },
} as const;
