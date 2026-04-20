'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from 'next/link';
import { Table, Tag, Button, Popconfirm, Space, Typography, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { CmsJobPosition } from '@/lib/cms';
import { deleteJobPosition } from '@/lib/cms/careers-actions';

interface JobPositionListTableProps {
  positions: CmsJobPosition[];
}

export function JobPositionListTable({ positions }: JobPositionListTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, title: string) => {
    startTransition(async () => {
      try {
        await deleteJobPosition(id);
        router.refresh();
      } catch {
        alert(`Failed to delete "${title}". Please try again.`);
      }
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: CmsJobPosition) => (
        <div>
          <Typography.Text strong style={{ display: 'block', fontSize: 13 }}>
            {title}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            /{record.slug}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 140,
      render: (dept: string | null) =>
        dept ? (
          <Tag style={{ fontSize: 11 }}>{dept}</Tag>
        ) : (
          <Typography.Text type="secondary">—</Typography.Text>
        ),
    },
    {
      title: 'Type / Location',
      key: 'type_location',
      width: 160,
      render: (_: unknown, record: CmsJobPosition) => {
        const c = record.content;
        return (
          <div>
            {c?.type && (
              <Typography.Text style={{ fontSize: 12, display: 'block' }}>
                {c.type}
              </Typography.Text>
            )}
            {c?.location && (
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                {c.location}
              </Typography.Text>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string, record: CmsJobPosition) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Tag
            color={status === 'published' ? 'green' : 'default'}
            style={{ fontSize: 11, width: 'fit-content' }}
          >
            {status === 'published' ? 'Published' : 'Draft'}
          </Tag>
          {record.has_unpublished_changes && (
            <Tag color="orange" style={{ fontSize: 10, width: 'fit-content' }}>
              Unsaved changes
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Last edited',
      key: 'last_edited',
      width: 160,
      render: (_: unknown, record: CmsJobPosition) => (
        <div>
          {record.last_edited_by_identifier && (
            <Typography.Text style={{ fontSize: 12, display: 'block' }}>
              {record.last_edited_by_identifier}
            </Typography.Text>
          )}
          {record.last_edited_at && (
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              {new Date(record.last_edited_at).toLocaleDateString('vi-VN')}
            </Typography.Text>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: CmsJobPosition) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Link href={`/admin/content/pages/careers/${record.id}`}>
              <Button icon={<EditOutlined />} size="small" type="text" />
            </Link>
          </Tooltip>
          <Popconfirm
            title="Delete this position?"
            description={`"${record.title}" will be permanently deleted.`}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record.id, record.title)}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              type="text"
              danger
              loading={isPending}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href="/admin/content/pages/careers/new">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
          >
            New Position
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={positions}
        rowKey="id"
        size="middle"
        pagination={false}
        locale={{ emptyText: 'No job positions yet. Create your first position!' }}
      />
    </div>
  );
}
