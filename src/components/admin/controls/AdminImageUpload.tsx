'use client';

import * as React from 'react';
import { Button, Image, Input, Space, Typography, Upload, theme } from 'antd';
import type { UploadProps } from 'antd';
import { CloseOutlined, CloudUploadOutlined } from '@ant-design/icons';
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
  /** Forwarded to inputs and buttons */
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
  const { token } = theme.useToken();
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

  const handleClear = () => {
    setUploadError(null);
    onChange?.('');
  };

  // ── antd Upload customRequest → Supabase Storage ──────────────────────────

  const handleCustomRequest: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    const f = file as File;

    // Client-side validation
    if (!ACCEPTED_IMAGE_TYPES.includes(f.type)) {
      const msg = 'Chỉ hỗ trợ định dạng ảnh: JPEG, PNG, GIF, WebP, SVG, AVIF.';
      setUploadError(msg);
      onError?.(new Error(msg));
      return;
    }

    if (f.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (f.size / 1024 / 1024).toFixed(2);
      const msg = `File quá lớn (${sizeMB} MB). Giới hạn tối đa là 3 MB.`;
      setUploadError(msg);
      onError?.(new Error(msg));
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const path = generateStoragePath(f);

      const { error: uploadErr } = await supabase.storage
        .from(CMS_ASSETS_BUCKET)
        .upload(path, f, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw new Error(uploadErr.message);

      const { data } = supabase.storage.from(CMS_ASSETS_BUCKET).getPublicUrl(path);
      onChange?.(data.publicUrl);
      onSuccess?.(data.publicUrl);
    } catch (err) {
      const msg =
        err instanceof Error
          ? `Upload thất bại: ${err.message}`
          : 'Upload thất bại. Vui lòng thử lại.';
      setUploadError(msg);
      onError?.(err instanceof Error ? err : new Error(msg));
    } finally {
      setUploading(false);
    }
  };

  const hasImage = Boolean(value && value.trim() !== '');

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={6}>
      {/* ── URL input + Upload button + Clear button ── */}
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={value ?? ''}
          onChange={handleUrlChange}
          disabled={disabled || uploading}
          placeholder="https://... hoặc upload file bên dưới"
          aria-label={label ?? 'Image URL'}
        />

        <Upload
          showUploadList={false}
          customRequest={handleCustomRequest}
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          disabled={disabled || uploading}
        >
          <Button
            icon={<CloudUploadOutlined style={{ fontSize: 14, width: 14, height: 14 }} />}
            loading={uploading}
            disabled={disabled}
            title="Tải ảnh lên từ máy tính (tối đa 3 MB)"
          >
            Upload
          </Button>
        </Upload>

        {hasImage && !uploading && (
          <Button
            icon={<CloseOutlined />}
            onClick={handleClear}
            disabled={disabled}
            title="Xoá URL ảnh"
          />
        )}
      </Space.Compact>

      {/* ── Error message ── */}
      {uploadError && (
        <Typography.Text type="danger" style={{ fontSize: 12 }}>
          {uploadError}
        </Typography.Text>
      )}

      {/* ── Image preview (antd built-in preview) ── */}
      {hasImage && !previewError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 8px',
            background: token.colorFillAlter,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusSM,
          }}
        >
          <Image
            src={value!}
            alt="Preview"
            onError={() => setPreviewError(true)}
            style={{
              height: 48,
              width: 'auto',
              maxWidth: 120,
              objectFit: 'contain',
              borderRadius: token.borderRadiusXS,
              border: `1px solid ${token.colorBorderSecondary}`,
              cursor: 'zoom-in',
            }}
            preview={{ src: value!, mask: 'Xem ảnh lớn' }}
          />
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            Preview
          </Typography.Text>
        </div>
      )}

      {/* ── Helper text ── */}
      <Typography.Text style={{ fontSize: 11, color: token.colorTextTertiary }}>
        Hỗ trợ JPEG, PNG, GIF, WebP, SVG, AVIF · Tối đa 3 MB
      </Typography.Text>
    </Space>
  );
}
