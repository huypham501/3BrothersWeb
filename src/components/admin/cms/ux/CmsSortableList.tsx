'use client';

import * as React from 'react';
import { Button, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { DndContext, DragOverlay, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CMS_SORTABLE_COLLISION,
  getMoveIndexesFromDragEnd,
  useCmsSortableSensors,
  useDragOrderedKeys,
} from './drag-sort-foundation';

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
    gridTemplateColumns: '1fr auto',
    alignItems: 'stretch',
    gap: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9d9d9',
    borderRadius: 8,
    background: '#fff',
    padding: 12,
  } as const,
  mainContent: {
    minWidth: 0,
  } as const,
  actionRail: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } as const,
  itemCardDragging: {
    opacity: 0.6,
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
  } as const,
  itemCardDropTarget: {
    borderColor: '#1677ff',
    boxShadow: '0 0 0 2px rgba(22, 119, 255, 0.2)',
  } as const,
  dragHandle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    color: '#8c8c8c',
    cursor: 'grab',
    border: 0,
    borderRadius: 6,
    background: 'transparent',
  } as const,
  dragHandleFocusVisible: {
    boxShadow: '0 0 0 2px rgba(22, 119, 255, 0.25)',
    color: '#1677ff',
  } as const,
  actions: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 } as const,
  empty: { margin: 0, color: '#8c8c8c', fontSize: 13 } as const,
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    border: 0,
  } as const,
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
  const sensors = useCmsSortableSensors();
  const orderedKeys = useDragOrderedKeys(items);
  const [activeKey, setActiveKey] = React.useState<Key | null>(null);
  const [overKey, setOverKey] = React.useState<Key | null>(null);

  const activeItem = React.useMemo(
    () => (activeKey == null ? null : items.find((item) => item.key === activeKey) ?? null),
    [activeKey, items]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const move = getMoveIndexesFromDragEnd(orderedKeys, event);
    setActiveKey(null);
    setOverKey(null);
    if (!move) return;
    onMove(move.fromIndex, move.toIndex);
  };

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

      {total > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={CMS_SORTABLE_COLLISION}
          onDragStart={(event) => {
            setActiveKey(event.active.id as Key);
            setOverKey(event.active.id as Key);
          }}
          onDragOver={(event) => {
            setOverKey((event.over?.id as Key | undefined) ?? null);
          }}
          onDragEnd={handleDragEnd}
          onDragCancel={() => {
            setActiveKey(null);
            setOverKey(null);
          }}
        >
          <SortableContext items={orderedKeys} strategy={verticalListSortingStrategy}>
            {items.map((item, index) => {
              const disableRemove = removeDisabled?.(index, total) ?? false;
              return (
                <SortableListRow
                  key={item.key}
                  id={item.key}
                  isDropTarget={overKey === item.key && activeKey !== item.key}
                  renderMainContent={renderItem({ item, index, total })}
                  renderActions={
                    onRemove ? (
                      <Button
                        size="small"
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => onRemove(index)}
                        disabled={disableRemove}
                        title="Remove"
                      />
                    ) : null
                  }
                />
              );
            })}
          </SortableContext>

          <DragOverlay>
            {activeItem ? <div style={{ ...styles.itemCard, ...styles.itemCardDragging }}>{renderItem({ item: activeItem, index: 0, total })}</div> : null}
          </DragOverlay>
        </DndContext>
      ) : null}
    </div>
  );
}

function SortableListRow({
  id,
  isDropTarget,
  renderMainContent,
  renderActions,
}: {
  id: Key;
  isDropTarget: boolean;
  renderMainContent: React.ReactNode;
  renderActions: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const { ['aria-describedby']: _ignoredAriaDescribedBy, ...dragAttributes } = attributes;
  const handleHelpId = React.useId();
  const [isHandleFocusVisible, setIsHandleFocusVisible] = React.useState(false);
  const isCoarsePointer = useIsCoarsePointer();
  const actionRailGap = isCoarsePointer ? 10 : 8;
  const actionButtonsGap = isCoarsePointer ? 10 : 8;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...styles.itemCard,
        ...(isDragging ? styles.itemCardDragging : null),
        ...(isDropTarget ? styles.itemCardDropTarget : null),
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <span id={handleHelpId} style={styles.srOnly}>
        Press Space or Enter to pick up, then use Arrow Up/Down to move, and press Space or Enter again to drop.
      </span>

      <div style={styles.mainContent}>{renderMainContent}</div>
      <div style={{ ...styles.actionRail, gap: actionRailGap }}>
        <button
          ref={setActivatorNodeRef}
          type="button"
          style={{
            ...styles.dragHandle,
            ...(isHandleFocusVisible ? styles.dragHandleFocusVisible : null),
          }}
          aria-label="Drag to reorder item"
          aria-describedby={handleHelpId}
          onFocus={(event) => {
            setIsHandleFocusVisible(event.currentTarget.matches(':focus-visible'));
          }}
          onBlur={() => {
            setIsHandleFocusVisible(false);
          }}
          {...dragAttributes}
          {...listeners}
        >
          <UnorderedListOutlined />
        </button>
        <div
          style={{ ...styles.actions, gap: actionButtonsGap }}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        >
          {renderActions}
        </div>
      </div>
    </div>
  );
}

function useIsCoarsePointer() {
  const [isCoarsePointer, setIsCoarsePointer] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarsePointer(mediaQuery.matches);
    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return isCoarsePointer;
}
