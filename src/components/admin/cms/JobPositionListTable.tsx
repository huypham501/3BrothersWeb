'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from 'next/link';
import { Table, Tag, Button, Popconfirm, Space, Typography, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CmsJobPosition } from '@/lib/cms';
import { deleteJobPosition, updateJobPositionSortOrder } from '@/lib/cms/careers-actions';
import {
  CMS_SORTABLE_COLLISION,
  getMoveIndexesFromDragEnd,
  useCmsSortableSensors,
} from './ux/drag-sort-foundation';

interface JobPositionListTableProps {
  positions: CmsJobPosition[];
}

export function JobPositionListTable({ positions }: JobPositionListTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orderedPositions, setOrderedPositions] = React.useState(positions);
  const sensors = useCmsSortableSensors();

  React.useEffect(() => {
    setOrderedPositions(positions);
  }, [positions]);

  const hasSortChanges = React.useMemo(
    () => orderedPositions.some((pos, index) => pos.id !== positions[index]?.id),
    [orderedPositions, positions]
  );

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

  const movePosition = (from: number, to: number) => {
    if (to < 0 || to >= orderedPositions.length) return;
    setOrderedPositions((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const handleSaveOrder = () => {
    if (!hasSortChanges) return;
    startTransition(async () => {
      try {
        await updateJobPositionSortOrder(
          orderedPositions.map((item, index) => ({
            id: item.id,
            sort_order: index,
          }))
        );
        router.refresh();
      } catch {
        alert('Failed to update position order. Please try again.');
      }
    });
  };

  const rowKeys = React.useMemo(() => orderedPositions.map((item) => item.id), [orderedPositions]);

  const columns: TableProps<CmsJobPosition>['columns'] = [
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
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
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
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Space>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSaveOrder}
            disabled={!hasSortChanges}
            loading={isPending}
          >
            Save Order
          </Button>
          <Link href="/admin/content/pages/careers/new">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
            >
              New Position
            </Button>
          </Link>
        </Space>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={CMS_SORTABLE_COLLISION}
        onDragEnd={(event) => {
          const move = getMoveIndexesFromDragEnd(rowKeys, event);
          if (!move) return;
          movePosition(move.fromIndex, move.toIndex);
        }}
      >
        <SortableContext items={rowKeys} strategy={verticalListSortingStrategy}>
          <Table
            columns={columns}
            dataSource={orderedPositions}
            rowKey="id"
            size="middle"
            pagination={false}
            locale={{ emptyText: 'No job positions yet. Create your first position!' }}
            components={{
              body: {
                row: SortableTableRow,
              },
            }}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface SortableTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key'?: string | number;
}

function SortableTableRow(props: SortableTableRowProps) {
  const rowKey = props['data-row-key'];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(rowKey),
  });

  return (
    <tr
      {...props}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={{
        ...props.style,
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        ...(isDragging
          ? {
              opacity: 0.65,
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            }
          : null),
      }}
    />
  );
}
