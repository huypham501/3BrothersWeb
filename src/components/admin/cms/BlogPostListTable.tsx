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
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import type { CmsBlogPost } from '@/lib/cms';
import { deleteBlogPost } from '@/lib/cms/blog-actions';

interface BlogPostListTableProps {
  posts: CmsBlogPost[];
}

export function BlogPostListTable({ posts }: BlogPostListTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, title: string) => {
    startTransition(async () => {
      try {
        await deleteBlogPost(id);
        router.refresh();
      } catch {
        alert(`Failed to delete "${title}". Please try again.`);
      }
    });
  };

  const columns = [
    {
      title: '',
      dataIndex: 'is_featured',
      key: 'is_featured',
      width: 32,
      render: (isFeatured: boolean) =>
        isFeatured ? (
          <Tooltip title="Featured">
            <StarFilled style={{ color: '#faad14', fontSize: 16 }} />
          </Tooltip>
        ) : (
          <StarOutlined style={{ color: '#d9d9d9', fontSize: 16 }} />
        ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: CmsBlogPost) => (
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
      title: 'Badge',
      dataIndex: 'badge',
      key: 'badge',
      width: 160,
      render: (badge: string | null) =>
        badge ? <Tag style={{ fontSize: 11 }}>{badge}</Tag> : <Typography.Text type="secondary">—</Typography.Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string, record: CmsBlogPost) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Tag color={status === 'published' ? 'green' : 'default'} style={{ fontSize: 11, width: 'fit-content' }}>
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
      render: (_: unknown, record: CmsBlogPost) => (
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
      render: (_: unknown, record: CmsBlogPost) => (
        <Space size="small">
          <Link href={`/admin/content/pages/blogs/${record.id}`}>
            <Button icon={<EditOutlined />} size="small" type="text" title="Edit" />
          </Link>
          <Popconfirm
            title="Delete this post?"
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
        <Link href="/admin/content/pages/blogs/new">
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#7c3aed', borderColor: '#7c3aed' }}>
            New Post
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        size="middle"
        pagination={false}
        locale={{ emptyText: 'No blog posts yet. Create your first post!' }}
      />
    </div>
  );
}
