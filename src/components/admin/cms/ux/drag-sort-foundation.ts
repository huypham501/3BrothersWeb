'use client';

import * as React from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  type CollisionDetection,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

type Key = string | number;

export interface DragMoveIndexes {
  fromIndex: number;
  toIndex: number;
}

export const CMS_SORTABLE_COLLISION: CollisionDetection = closestCenter;

/**
 * Shared drag sensors for CMS sortable UIs:
 * - Pointer: desktop mouse/trackpad
 * - Touch: mobile/touch devices
 * - Keyboard: accessibility flow via dnd-kit keyboard coordinates
 */
export function useCmsSortableSensors() {
  return useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
}

/**
 * Resolves source/target indexes from dnd-kit drag-end event.
 * Returns null when drag should not mutate ordering.
 */
export function getMoveIndexesFromDragEnd(keys: Key[], event: DragEndEvent): DragMoveIndexes | null {
  const { active, over } = event;
  if (!over || active.id === over.id) return null;

  const fromIndex = keys.findIndex((key) => key === active.id);
  const toIndex = keys.findIndex((key) => key === over.id);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null;

  return { fromIndex, toIndex };
}

export function useDragOrderedKeys<T extends { key: Key }>(items: T[]) {
  return React.useMemo(() => items.map((item) => item.key), [items]);
}
