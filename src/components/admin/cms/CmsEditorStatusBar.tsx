'use client';

import * as React from 'react';
import { Button, Tag, Typography, Descriptions } from 'antd';
import { CloudUploadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export interface CmsEditorStatusBarProps {
  /** Display name of the page, e.g. "Home CMS" or "For Creators CMS" */
  pageTitle: string;
  /** True when there are saved drafts not yet visible on the public site */
  hasUnpublished: boolean;
  lastEditedBy?: string | null;
  lastEditedAt?: string | null;
  lastPublishedBy?: string | null;
  lastPublishedAt?: string | null;
  /** User's CMS role string, shown for context */
  role: string;
  canPublish: boolean;
  isPublishing: boolean;
  onPublish: () => void;
  /** Button label, defaults to "Publish" */
  publishLabel?: string;
}

function fmtDate(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CmsEditorStatusBar({
  pageTitle,
  hasUnpublished,
  lastEditedBy,
  lastEditedAt,
  lastPublishedBy,
  lastPublishedAt,
  role,
  canPublish,
  isPublishing,
  onPublish,
  publishLabel = 'Publish',
}: CmsEditorStatusBarProps) {
  return (
    <div style={styles.wrapper}>
      {/* ── Title row ── */}
      <div style={styles.titleRow}>
        <div style={styles.titleGroup}>
          <Typography.Title level={5} style={styles.title}>
            {pageTitle}
          </Typography.Title>
          {hasUnpublished ? (
            <Tag
              icon={<ExclamationCircleOutlined />}
              color="warning"
              style={styles.tag}
            >
              Có thay đổi chưa publish
            </Tag>
          ) : (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              style={styles.tag}
            >
              Đã publish
            </Tag>
          )}
        </div>

        <Button
          type="primary"
          icon={<CloudUploadOutlined />}
          loading={isPublishing}
          disabled={!hasUnpublished || isPublishing || !canPublish}
          onClick={onPublish}
          title={
            !canPublish
              ? 'Bạn không có quyền publish.'
              : !hasUnpublished
              ? 'Không có thay đổi cần publish.'
              : undefined
          }
          style={hasUnpublished && canPublish ? styles.publishBtn : undefined}
        >
          {isPublishing ? 'Đang publish...' : publishLabel}
        </Button>
      </div>

      {/* ── Audit info row ── */}
      <Descriptions size="small" column={{ xs: 1, sm: 2, md: 4 }} style={styles.descriptions}>
        <Descriptions.Item label="Người sửa cuối">
          <Typography.Text type="secondary" style={styles.auditText}>
            {lastEditedBy ?? '—'}
          </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="Thời điểm sửa">
          <Typography.Text type="secondary" style={styles.auditText}>
            {fmtDate(lastEditedAt)}
          </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="Người publish cuối">
          <Typography.Text type="secondary" style={styles.auditText}>
            {lastPublishedBy ?? '—'}
          </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="Thời điểm publish">
          <Typography.Text type="secondary" style={styles.auditText}>
            {fmtDate(lastPublishedAt)}
          </Typography.Text>
        </Descriptions.Item>
      </Descriptions>

      {!canPublish && (
        <Typography.Text type="secondary" style={styles.roleNote}>
          Role hiện tại (<strong>{role}</strong>) không có quyền publish.
        </Typography.Text>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    background: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: 8,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap' as const,
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap' as const,
  },
  title: {
    margin: 0,
    fontSize: 15,
  },
  tag: {
    margin: 0,
    fontSize: 12,
  },
  publishBtn: {
    background: '#7c3aed',
    borderColor: '#7c3aed',
  },
  descriptions: {
    borderTop: '1px solid #f5f5f5',
    paddingTop: 10,
  },
  auditText: {
    fontSize: 12,
  },
  roleNote: {
    fontSize: 12,
    display: 'block' as const,
  },
} as const;
