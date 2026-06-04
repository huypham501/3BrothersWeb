'use client';

import * as React from 'react';
import { Alert, Descriptions, Empty, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { CmsAuditLog } from '@/lib/cms';
import type { CmsAuditLogListParams } from '@/lib/cms/queries';
import {
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
  AdminCardTitle,
} from '@/components/admin/layout/AdminPrimitives';
import {
  AUDIT_ACTION_COLORS,
  AUDIT_ACTION_LABELS,
  AUDIT_ENTITY_LABELS,
  formatAuditDate,
  truncateAuditSummary,
} from './audit-log-labels';

interface CmsAuditLogListProps {
  logs: CmsAuditLog[];
  params?: CmsAuditLogListParams;
  total?: number;
  error?: string | null;
}

function DetailValue({ children }: { children: React.ReactNode }) {
  return children ? children : <Typography.Text type="secondary">-</Typography.Text>;
}

function buildAuditListPath(params: CmsAuditLogListParams): string {
  const query = new URLSearchParams();

  if (params.page !== 1) query.set('page', String(params.page));
  if (params.pageSize !== 25) query.set('pageSize', String(params.pageSize));
  if (params.actionType) query.set('action_type', params.actionType);
  if (params.entityType) query.set('entity_type', params.entityType);
  if (params.actorSearch) query.set('actor', params.actorSearch);
  if (params.entitySearch) query.set('entity', params.entitySearch);
  if (params.createdFrom) query.set('createdFrom', params.createdFrom);
  if (params.createdTo) query.set('createdTo', params.createdTo);

  const qs = query.toString();
  return qs ? `/admin/content/audit?${qs}` : '/admin/content/audit';
}

export function CmsAuditLogList({ logs, params, total, error }: CmsAuditLogListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const columns = React.useMemo<ColumnsType<CmsAuditLog>>(() => [
    {
      title: 'Time',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      defaultSortOrder: 'descend',
      render: (createdAt: string) => (
        <Typography.Text style={{ whiteSpace: 'nowrap' }}>{formatAuditDate(createdAt)}</Typography.Text>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action_type',
      key: 'action_type',
      width: 140,
      render: (actionType: CmsAuditLog['action_type']) => (
        <Tag
          color={AUDIT_ACTION_COLORS[actionType]}
          icon={actionType === 'publish' ? <CheckCircleOutlined /> : <EditOutlined />}
        >
          {AUDIT_ACTION_LABELS[actionType]}
        </Tag>
      ),
    },
    {
      title: 'Entity',
      key: 'entity',
      width: 260,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Space size={4} wrap>
            <Tag>{AUDIT_ENTITY_LABELS[record.entity_type]}</Tag>
            <Typography.Text strong>{record.entity_key_or_id}</Typography.Text>
          </Space>
          {record.page_slug_or_schema_key && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.page_slug_or_schema_key}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Actor',
      key: 'actor',
      width: 280,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Typography.Text>{record.actor_email_or_identifier}</Typography.Text>
          <Tag color="blue" style={{ width: 'fit-content' }}>{record.actor_role}</Tag>
        </Space>
      ),
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      render: (summary: string) => (
        <Tooltip title={summary}>
          <Typography.Text ellipsis style={{ maxWidth: 420 }}>
            {truncateAuditSummary(summary)}
          </Typography.Text>
        </Tooltip>
      ),
    },
  ], []);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (!params) return;

    const nextParams: CmsAuditLogListParams = {
      ...params,
      page: pagination.current ?? params.page,
      pageSize: pagination.pageSize ?? params.pageSize,
    };

    startTransition(() => {
      router.push(buildAuditListPath(nextParams));
    });
  };

  return (
    <AdminCard>
      <AdminCardHeader>
        <AdminCardTitle>Recent CMS Activity</AdminCardTitle>
      </AdminCardHeader>
      <AdminCardContent>
        {error && (
          <Alert
            type="error"
            message="Audit logs could not be loaded"
            description={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          size="middle"
          loading={isPending}
          scroll={{ x: 1080 }}
          locale={{ emptyText: <Empty description="No audit activity found yet" /> }}
          pagination={params ? {
            current: params.page,
            pageSize: params.pageSize,
            total: total ?? logs.length,
            showSizeChanger: true,
            pageSizeOptions: [25, 50, 100],
          } : false}
          onChange={handleTableChange}
          expandable={{
            expandedRowRender: (record) => (
              <Descriptions
                bordered
                column={{ xs: 1, sm: 2, lg: 3 }}
                size="small"
                items={[
                  {
                    key: 'id',
                    label: 'Audit ID',
                    children: <Typography.Text copyable>{record.id}</Typography.Text>,
                  },
                  {
                    key: 'actor_user_id',
                    label: 'Actor user ID',
                    children: (
                      <DetailValue>
                        <Typography.Text copyable>{record.actor_user_id}</Typography.Text>
                      </DetailValue>
                    ),
                  },
                  {
                    key: 'actor_role',
                    label: 'Actor role',
                    children: record.actor_role,
                  },
                  {
                    key: 'actor_email',
                    label: 'Actor email',
                    children: record.actor_email_or_identifier,
                  },
                  {
                    key: 'action',
                    label: 'Action',
                    children: AUDIT_ACTION_LABELS[record.action_type],
                  },
                  {
                    key: 'entity_type',
                    label: 'Entity type',
                    children: AUDIT_ENTITY_LABELS[record.entity_type],
                  },
                  {
                    key: 'entity_id',
                    label: 'Entity ID',
                    children: (
                      <DetailValue>
                        {record.entity_id && <Typography.Text copyable>{record.entity_id}</Typography.Text>}
                      </DetailValue>
                    ),
                  },
                  {
                    key: 'entity_key',
                    label: 'Entity key',
                    children: record.entity_key_or_id,
                  },
                  {
                    key: 'page_schema_key',
                    label: 'Page/schema key',
                    children: <DetailValue>{record.page_slug_or_schema_key}</DetailValue>,
                  },
                  {
                    key: 'created',
                    label: 'Created',
                    children: formatAuditDate(record.created_at),
                  },
                  {
                    key: 'summary',
                    label: 'Summary',
                    span: { xs: 1, sm: 2, lg: 3 },
                    children: record.summary,
                  },
                ]}
              />
            ),
          }}
        />
      </AdminCardContent>
    </AdminCard>
  );
}
