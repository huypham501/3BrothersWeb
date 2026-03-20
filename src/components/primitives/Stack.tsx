'use client';

/**
 * Stack Component
 * Flexbox layout for stacking items with consistent spacing
 */

import styled from 'styled-components';

type Direction = 'row' | 'column';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type Spacing = keyof typeof import('@/styles/tokens').spacing;

interface StackProps {
  $direction?: Direction;
  $align?: Align;
  $justify?: Justify;
  $gap?: Spacing | string;
  $wrap?: boolean;
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};


export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: ${({ $direction = 'column' }) => $direction};
  align-items: ${({ $align = 'stretch' }) => alignMap[$align]};
  justify-content: ${({ $justify = 'start' }) => justifyMap[$justify]};
  gap: ${({ $gap = '3', theme }) => {
    // If it's a token key, use from theme
    if ($gap in theme.spacing) {
      return theme.spacing[$gap as Spacing];
    }
    // Otherwise use as-is (for custom values)
    return $gap;
  }};
  flex-wrap: ${({ $wrap = false }) => ($wrap ? 'wrap' : 'nowrap')};
`;
