'use client';

import * as React from 'react';
import { Button, Typography, Alert } from 'antd';
import { CloudUploadOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { publishAllContent } from '@/lib/cms/publish';
import type { PublishResult } from '@/lib/cms/publish';

type PublishStatus = 'idle' | 'publishing' | 'success' | 'error';

export function PublishCenterClient() {
  const [status, setStatus] = React.useState<PublishStatus>('idle');
  const [result, setResult] = React.useState<PublishResult | null>(null);

  async function handlePublish() {
    setStatus('publishing');
    setResult(null);

    try {
      const res = await publishAllContent();
      setResult(res);
      setStatus(res.success ? 'success' : 'error');
    } catch (err) {
      setResult({
        success: false,
        publishedAt: new Date().toISOString(),
        routesRevalidated: [],
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong đợi.',
      });
      setStatus('error');
    }
  }

  const isPublishing = status === 'publishing';

  return (
    <div style={styles.wrapper}>
      {/* ── Description card ── */}
      <div style={styles.card}>
        <Typography.Title level={5} style={{ margin: '0 0 8px' }}>
          Publish toàn bộ nội dung
        </Typography.Title>
        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
          Sau khi bạn đã chỉnh sửa và xem lại tất cả nội dung, bấm nút bên dưới để cập nhật
          toàn bộ trang web public. Cache sẽ được xóa và dữ liệu mới nhất từ CMS sẽ được
          hiển thị ngay lập tức.
        </Typography.Text>

        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          message={
            <span>
              Hãy chắc chắn bạn đã <strong>review và publish từng section</strong> trong các
              editor trước khi bấm Publish tại đây. Thao tác này chỉ làm mới cache — không
              tự động publish các draft chưa được publish.
            </span>
          }
          style={{ marginBottom: 24 }}
        />

        <Button
          type="primary"
          size="large"
          icon={<CloudUploadOutlined />}
          loading={isPublishing}
          disabled={isPublishing}
          onClick={handlePublish}
          style={styles.publishButton}
        >
          {isPublishing ? 'Đang publish...' : 'Publish tất cả thay đổi'}
        </Button>
      </div>

      {/* ── Result feedback ── */}
      {status === 'success' && result?.success && (
        <div style={styles.card}>
          <div style={styles.successHeader}>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
            <Typography.Text strong style={{ color: '#52c41a', fontSize: 15 }}>
              Publish thành công!
            </Typography.Text>
          </div>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            Thời điểm:{' '}
            <strong>
              {new Date(result.publishedAt).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </strong>
          </Typography.Text>
          <Typography.Text type="secondary" style={{ display: 'block' }}>
            Các route đã được revalidate:
          </Typography.Text>
          <ul style={styles.routeList}>
            {result.routesRevalidated.map((r) => (
              <li key={r} style={styles.routeItem}>
                <code style={styles.routeCode}>{r}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'error' && result && (
        <Alert
          type="error"
          showIcon
          message="Publish thất bại"
          description={result.error ?? 'Đã xảy ra lỗi. Vui lòng thử lại.'}
        />
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
  },
  card: {
    background: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: 8,
    padding: '24px 28px',
  },
  publishButton: {
    height: 44,
    fontSize: 15,
    paddingLeft: 28,
    paddingRight: 28,
    background: '#7c3aed',
    borderColor: '#7c3aed',
  },
  successHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  routeList: {
    margin: '8px 0 0',
    paddingLeft: 20,
  },
  routeItem: {
    marginBottom: 4,
  },
  routeCode: {
    background: '#f5f5f5',
    padding: '1px 6px',
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'monospace',
  },
} as const;
