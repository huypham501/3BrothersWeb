import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const DESCRIPTION_LINE_HEIGHT_PX = 24;
const CLAMP_LINES = 4;
const CLAMP_MAX_HEIGHT = DESCRIPTION_LINE_HEIGHT_PX * CLAMP_LINES;

export function useInlineDescriptionClamp(text: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLParagraphElement>(null);
  const measureTextRef = useRef<HTMLSpanElement>(null);
  const measureSuffixRef = useRef<HTMLSpanElement>(null);

  const [isExpandable, setIsExpandable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleText, setVisibleText] = useState(text);

  const recalculate = useCallback(() => {
    const measure = measureRef.current;
    const textNode = measureTextRef.current;
    const suffixNode = measureSuffixRef.current;
    if (!measure || !textNode || !suffixNode) return;

    textNode.textContent = text;
    suffixNode.style.display = 'none';

    if (measure.scrollHeight <= CLAMP_MAX_HEIGHT + 1) {
      setIsExpandable(false);
      setVisibleText(text);
      return;
    }

    setIsExpandable(true);
    suffixNode.style.display = 'inline';

    let left = 0;
    let right = text.length;
    let bestFit = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      textNode.textContent = text.slice(0, mid).trimEnd();
      const fits = measure.scrollHeight <= CLAMP_MAX_HEIGHT + 1;

      if (fits) {
        bestFit = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    const truncated = text.slice(0, bestFit).trimEnd();
    setVisibleText(truncated || text.slice(0, Math.max(0, bestFit - 1)).trimEnd());
  }, [text]);

  useLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  useEffect(() => {
    setIsExpanded(false);
  }, [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      recalculate();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [recalculate]);

  return {
    containerRef,
    measureRef,
    measureTextRef,
    measureSuffixRef,
    isExpandable,
    isExpanded,
    setIsExpanded,
    visibleText,
  };
}
