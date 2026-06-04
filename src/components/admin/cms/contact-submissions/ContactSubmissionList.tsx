'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Empty, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type {
  ContactSubmissionListParams,
  ContactSubmissionRow,
} from '@/lib/contact/contact-submissions.types';
import {
  CONTACT_STATUS_COLORS,
  CONTACT_STATUS_LABELS,
  formatContactDate,
  getErrorCategoryColor,
  getErrorCategoryLabel,
  truncateMessage,
} from './contact-submission-labels';

interface ContactSubmissionListProps {
  rows: ContactSubmissionRow[];
  params: ContactSubmissionListParams;
  total: number;
  listPath: string;
}

function dash(value: string | null) {
  return value ? value : <Typography.Text type="secondary">-</Typography.Text>;
}

export function ContactSubmissionList({ rows, params, total, listPath }: ContactSubmissionListProps) {
  const router = useRouter();

  const columns: ColumnsType<ContactSubmissionRow> = [
    {
      title: 'Contact',
      key: 'contact',
      width: 260,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{dash(record.fullname)}</Typography.Text>
          <Typography.Text copyable={!!record.email} type={record.email ? undefined : 'secondary'}>
            {dash(record.email)}
          </Typography.Text>
          <Typography.Text copyable={!!record.phone} type={record.phone ? undefined : 'secondary'}>
            {dash(record.phone)}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (message: string | null) => {
        const preview = truncateMessage(message);
        return preview ? (
          <Tooltip title={preview}>
            <Typography.Text>{preview}</Typography.Text>
          </Tooltip>
        ) : (
          <Typography.Text type="secondary">-</Typography.Text>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'mail_status',
      key: 'mail_status',
      width: 120,
      render: (status: ContactSubmissionRow['mail_status']) => (
        <Tag color={CONTACT_STATUS_COLORS[status]}>{CONTACT_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'error_category',
      key: 'error_category',
      width: 190,
      render: (category: ContactSubmissionRow['error_category']) => (
        <Tag color={getErrorCategoryColor(category)}>{getErrorCategoryLabel(category)}</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 170,
      render: (createdAt: string) => formatContactDate(createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Link
          href={`/admin/content/contact-submissions/${record.id}?returnTo=${encodeURIComponent(listPath)}`}
        >
          <Button icon={<EyeOutlined />} size="small" type="link">
            View
          </Button>
        </Link>
      ),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const query = new URLSearchParams();
    const nextPage = pagination.current ?? params.page;
    const nextPageSize = pagination.pageSize ?? params.pageSize;

    if (nextPage !== 1) query.set('page', String(nextPage));
    if (nextPageSize !== 25) query.set('pageSize', String(nextPageSize));
    if (params.mailStatus) query.set('mail_status', params.mailStatus);
    if (params.errorCategory) query.set('error_category', params.errorCategory);
    if (params.createdFrom) query.set('createdFrom', params.createdFrom);
    if (params.createdTo) query.set('createdTo', params.createdTo);

    const qs = query.toString();
    router.push(qs ? `/admin/content/contact-submissions?${qs}` : '/admin/content/contact-submissions');
  };

  return (
    <Table
      columns={columns}
      dataSource={rows}
      rowKey="id"
      size="middle"
      scroll={{ x: 980 }}
      locale={{ emptyText: <Empty description="No contact submissions found" /> }}
      pagination={{
        current: params.page,
        pageSize: params.pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [25, 50, 100],
      }}
      onChange={handleTableChange}
    />
  );
}
