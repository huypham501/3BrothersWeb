'use client';

import * as React from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

// ─── Constants ────────────────────────────────────────────────────────────────

const CMS_ASSETS_BUCKET = 'cms-assets';
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
];

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdminImageUploadProps = {
  /** Current image URL stored in the CMS field */
  value?: string | null;
  /** Called with the new public URL after a successful upload, or with the typed URL */
  onChange?: (url: string) => void;
  /** Forwarded to the hidden file input */
  disabled?: boolean;
  /** Optional label shown above the URL input (for accessibility) */
  label?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

function generateStoragePath(file: File): string {
  const ext = file.name.split('.').pop() ?? 'bin';
  const base = sanitizeFilename(file.name.replace(/\.[^.]+$/, ''));
  const uid = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  return `images/${uid}-${base}.${ext}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminImageUpload({
  value,
  onChange,
  disabled = false,
  label,
}: AdminImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [previewError, setPreviewError] = React.useState(false);

  // Reset preview error when URL changes
  React.useEffect(() => {
    setPreviewError(false);
  }, [value]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    onChange?.(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected after clearing
    e.target.value = '';

    setUploadError(null);

    // ── Client-side validation ──────────────────────────────────────────────

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Chỉ hỗ trợ định dạng ảnh: JPEG, PNG, GIF, WebP, SVG, AVIF.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setUploadError(`File quá lớn (${sizeMB} MB). Giới hạn tối đa là 3 MB.`);
      return;
    }

    // ── Upload to Supabase Storage ──────────────────────────────────────────

    setUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const path = generateStoragePath(file);

      const { error: uploadErr } = await supabase.storage
        .from(CMS_ASSETS_BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadErr) {
        throw new Error(uploadErr.message);
      }

      const { data } = supabase.storage
        .from(CMS_ASSETS_BUCKET)
        .getPublicUrl(path);

      onChange?.(data.publicUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? `Upload thất bại: ${err.message}`
          : 'Upload thất bại. Vui lòng thử lại.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setUploadError(null);
    onChange?.('');
  };

  const hasImage = Boolean(value && value.trim() !== '');

  return (
    <div style={styles.wrapper}>
      {/* ── URL Text Input Row ── */}
      <div style={styles.inputRow}>
        <input
          type="text"
          value={value ?? ''}
          onChange={handleUrlChange}
          disabled={disabled || uploading}
          placeholder="https://... hoặc upload file bên dưới"
          aria-label={label ?? 'Image URL'}
          style={styles.urlInput}
        />

        {/* Upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          title="Tải ảnh lên từ máy tính (tối đa 3 MB)"
          style={{
            ...styles.uploadButton,
            opacity: disabled || uploading ? 0.5 : 1,
            cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? (
            <span style={styles.spinnerRow}>
              <span style={styles.spinner} />
              Uploading...
            </span>
          ) : (
            <span style={styles.uploadLabel}>
              <UploadIcon />
              Upload
            </span>
          )}
        </button>

        {/* Clear button */}
        {hasImage && !uploading && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            title="Xoá URL ảnh"
            style={styles.clearButton}
          >
            ✕
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden
        />
      </div>

      {/* ── Error message ── */}
      {uploadError && (
        <p style={styles.errorText}>{uploadError}</p>
      )}

      {/* ── Image preview ── */}
      {hasImage && !previewError && (
        <div style={styles.previewWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value!}
            alt="Preview"
            onError={() => setPreviewError(true)}
            style={styles.preview}
          />
          <span style={styles.previewLabel}>Preview</span>
        </div>
      )}

      {/* ── Helper text ── */}
      <p style={styles.hint}>
        Hỗ trợ JPEG, PNG, GIF, WebP, SVG, AVIF · Tối đa 3 MB
      </p>
    </div>
  );
}

// ─── Tiny inline icon ─────────────────────────────────────────────────────────

function UploadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

// ─── Styles (plain CSSProperties – no external deps) ─────────────────────────

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    width: '100%',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  urlInput: {
    flex: 1,
    height: '32px',
    padding: '0 11px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #d9d9d9',
    outline: 'none',
    background: '#fff',
    color: '#000',
    boxSizing: 'border-box' as const,
    minWidth: 0,
  },
  uploadButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    height: '32px',
    padding: '0 12px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '6px',
    border: '1px solid #d9d9d9',
    background: '#fff',
    color: '#555',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
    transition: 'background 0.15s',
  },
  uploadLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  },
  spinnerRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  spinner: {
    width: '12px',
    height: '12px',
    border: '2px solid #ccc',
    borderTop: '2px solid #555',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  clearButton: {
    height: '32px',
    width: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    borderRadius: '6px',
    border: '1px solid #d9d9d9',
    background: '#fff',
    color: '#999',
    cursor: 'pointer',
    flexShrink: 0,
  },
  errorText: {
    margin: 0,
    fontSize: '12px',
    color: '#ff4d4f',
  },
  previewWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    background: '#fafafa',
    border: '1px solid #f0f0f0',
    borderRadius: '6px',
  },
  preview: {
    height: '48px',
    width: 'auto',
    maxWidth: '120px',
    objectFit: 'contain' as const,
    borderRadius: '4px',
    border: '1px solid #e8e8e8',
  },
  previewLabel: {
    fontSize: '11px',
    color: '#aaa',
  },
  hint: {
    margin: 0,
    fontSize: '11px',
    color: '#bbb',
  },
} as const;
