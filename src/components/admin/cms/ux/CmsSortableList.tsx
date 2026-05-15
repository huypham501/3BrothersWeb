'use client';

import * as React from 'react';
import { Button, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, DragOutlined, PlusOutlined } from '@ant-design/icons';

type Key = string | number;

export interface CmsSortableListItem<T> {
  key: Key;
  value: T;
}

export interface CmsSortableListProps<T> {
  title: React.ReactNode;
  items: CmsSortableListItem<T>[];
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove?: (index: number) => void;
  onAdd?: () => void;
  addLabel?: string;
  removeDisabled?: (index: number, total: number) => boolean;
  emptyText?: React.ReactNode;
  renderItem: (args: { item: CmsSortableListItem<T>; index: number; total: number }) => React.ReactNode;
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: 12 } as const,
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' } as const,
  title: { margin: 0, fontSize: 16, fontWeight: 600 } as const,
  itemCard: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'start',
    gap: 12,
    border: '1px solid #d9d9d9',
    borderRadius: 8,
    background: '#fff',
    padding: 12,
  } as const,
  dragHandle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    color: '#8c8c8c',
    cursor: 'grab',
    paddingTop: 4,
  } as const,
  actions: { display: 'flex', flexDirection: 'column', gap: 4 } as const,
  empty: { margin: 0, color: '#8c8c8c', fontSize: 13 } as const,
};

export function CmsSortableList<T>({
  title,
  items,
  onMove,
  onRemove,
  onAdd,
  addLabel = 'Add Item',
  removeDisabled,
  emptyText = 'No items yet.',
  renderItem,
}: CmsSortableListProps<T>) {
  const total = items.length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h5 style={styles.title}>{title}</h5>
        {onAdd ? (
          <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={onAdd}>
            {addLabel}
          </Button>
        ) : null}
      </div>

      {total === 0 ? (
        <Typography.Paragraph style={styles.empty}>{emptyText}</Typography.Paragraph>
      ) : null}

      {items.map((item, index) => {
        const disableUp = index === 0;
        const disableDown = index === total - 1;
        const disableRemove = removeDisabled?.(index, total) ?? false;

        return (
          <div key={item.key} style={styles.itemCard}>
            <span aria-hidden style={styles.dragHandle} title="Drag handle (Phase 3)">
              <DragOutlined />
            </span>

            <div>{renderItem({ item, index, total })}</div>

            <div style={styles.actions}>
              <Button
                size="small"
                type="text"
                icon={<ArrowUpOutlined />}
                onClick={() => onMove(index, index - 1)}
                disabled={disableUp}
                title="Move up"
              />
              <Button
                size="small"
                type="text"
                icon={<ArrowDownOutlined />}
                onClick={() => onMove(index, index + 1)}
                disabled={disableDown}
                title="Move down"
              />
              {onRemove ? (
                <Button
                  size="small"
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => onRemove(index)}
                  disabled={disableRemove}
                  title="Remove"
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
