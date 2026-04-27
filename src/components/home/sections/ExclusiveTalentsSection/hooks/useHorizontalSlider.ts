import { useCallback, useEffect, useRef, useState } from 'react';
import type { DragEvent, PointerEvent } from 'react';

export function useHorizontalSlider() {
  const DRAG_THRESHOLD_PX = 6;

  const rowRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isTrackDraggingRef = useRef(false);
  const isRowPointerActiveRef = useRef(false);
  const isRowDraggingRef = useRef(false);
  const rowDragStartXRef = useRef(0);
  const rowDragStartScrollLeftRef = useRef(0);

  const [isTrackDragging, setIsTrackDragging] = useState(false);
  const [isRowDragging, setIsRowDragging] = useState(false);

  const updateScrollbar = useCallback(() => {
    const row = rowRef.current;
    const fill = fillRef.current;
    const track = trackRef.current;
    if (!row || !fill || !track) return;

    const scrollable = row.scrollWidth - row.clientWidth;
    if (scrollable <= 0) {
      fill.style.width = '100%';
      fill.style.left = '0px';
      return;
    }

    const trackW = track.clientWidth;
    const ratio = row.scrollLeft / scrollable;
    const fillW = Math.max(40, (row.clientWidth / row.scrollWidth) * trackW);
    const maxLeft = trackW - fillW;

    fill.style.width = `${fillW}px`;
    fill.style.left = `${ratio * maxLeft}px`;
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return;

    updateScrollbar();
    row.addEventListener('scroll', updateScrollbar, { passive: true });

    const observer = new ResizeObserver(() => {
      updateScrollbar();
    });

    observer.observe(row);
    observer.observe(track);

    return () => {
      row.removeEventListener('scroll', updateScrollbar);
      observer.disconnect();
    };
  }, [updateScrollbar]);

  const scrubByTrackClientX = useCallback((clientX: number) => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return;

    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    row.scrollLeft = ratio * (row.scrollWidth - row.clientWidth);
  }, []);

  const onTrackPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    isTrackDraggingRef.current = true;
    setIsTrackDragging(true);
    track.setPointerCapture(e.pointerId);
    scrubByTrackClientX(e.clientX);
  };

  const onTrackPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isTrackDraggingRef.current) return;
    scrubByTrackClientX(e.clientX);
  };

  const onTrackPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    isTrackDraggingRef.current = false;
    setIsTrackDragging(false);

    if (track?.hasPointerCapture(e.pointerId)) {
      track.releasePointerCapture(e.pointerId);
    }
  };

  const onRowPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const row = rowRef.current;
    if (!row) return;

    isRowPointerActiveRef.current = true;
    isRowDraggingRef.current = false;
    setIsRowDragging(false);
    rowDragStartXRef.current = e.clientX;
    rowDragStartScrollLeftRef.current = row.scrollLeft;
  };

  const onRowPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isRowPointerActiveRef.current) return;

    const row = rowRef.current;
    if (!row) return;

    const deltaX = e.clientX - rowDragStartXRef.current;
    if (!isRowDraggingRef.current && Math.abs(deltaX) >= DRAG_THRESHOLD_PX) {
      isRowDraggingRef.current = true;
      setIsRowDragging(true);
      row.setPointerCapture(e.pointerId);
    }

    if (!isRowDraggingRef.current) return;

    row.scrollLeft = rowDragStartScrollLeftRef.current - deltaX;
  };

  const onRowPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    isRowPointerActiveRef.current = false;
    isRowDraggingRef.current = false;
    setIsRowDragging(false);

    if (row?.hasPointerCapture(e.pointerId)) {
      row.releasePointerCapture(e.pointerId);
    }
  };

  const onRowDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return {
    rowRef,
    fillRef,
    trackRef,
    isTrackDragging,
    isRowDragging,
    trackEvents: {
      onPointerDown: onTrackPointerDown,
      onPointerMove: onTrackPointerMove,
      onPointerUp: onTrackPointerUp,
      onPointerCancel: onTrackPointerUp,
    },
    rowEvents: {
      onPointerDown: onRowPointerDown,
      onPointerMove: onRowPointerMove,
      onPointerUp: onRowPointerUp,
      onPointerCancel: onRowPointerUp,
      onDragStart: onRowDragStart,
    },
  };
}
