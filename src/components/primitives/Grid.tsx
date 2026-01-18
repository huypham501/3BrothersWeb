'use client';

/**
 * Grid Component
 * CSS Grid layout with responsive columns
 */

import styled from 'styled-components';
import { mq } from '@/styles/mediaQueries';

type Spacing = keyof typeof import('@/styles/tokens').spacing;

interface GridProps {
  $columns?: number;
  $columnsMd?: number;
  $columnsLg?: number;
  $gap?: Spacing | string;
  $rowGap?: Spacing | string;
  $columnGap?: Spacing | string;
}

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: repeat(${({ $columns = 1 }) => $columns}, 1fr);
  gap: ${({ $gap = '3', theme }) => {
    if ($gap in theme.spacing) {
      return theme.spacing[$gap as Spacing];
    }
    return $gap;
  }};

  ${({ $rowGap, theme }) =>
    $rowGap &&
    `row-gap: ${$rowGap in theme.spacing ? theme.spacing[$rowGap as Spacing] : $rowGap};`}

  ${({ $columnGap, theme }) =>
    $columnGap &&
    `column-gap: ${$columnGap in theme.spacing ? theme.spacing[$columnGap as Spacing] : $columnGap};`}

  ${({ $columnsMd }) =>
    $columnsMd &&
    `${mq.md} {
      grid-template-columns: repeat(${$columnsMd}, 1fr);
    }`}

  ${({ $columnsLg }) =>
    $columnsLg &&
    `${mq.lg} {
      grid-template-columns: repeat(${$columnsLg}, 1fr);
    }`}
`;

// Bootstrap-style row for flex-based grid
export const Row = styled.div<{ $gutter?: string; $noGutters?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  margin-right: ${({ $noGutters }) => ($noGutters ? 0 : '-15px')};
  margin-left: ${({ $noGutters }) => ($noGutters ? 0 : '-15px')};
`;

// Bootstrap-style col
interface ColProps {
  $auto?: boolean;
  $span?: number;
  $spanMd?: number;
  $spanLg?: number;
  $spanXl?: number;
}

export const Col = styled.div<ColProps>`
  flex: ${({ $auto, $span }) => 
    $auto ? '0 0 auto' : 
    $span ? `0 0 ${($span / 12) * 100}%` : '1 0 0%'
  };
  max-width: ${({ $span }) => ($span ? `${($span / 12) * 100}%` : '100%')};
  padding-right: 15px;
  padding-left: 15px;

  ${({ $spanMd }) =>
    $spanMd &&
    `${mq.md} {
      flex: 0 0 ${($spanMd / 12) * 100}%;
      max-width: ${($spanMd / 12) * 100}%;
    }`}

  ${({ $spanLg }) =>
    $spanLg &&
    `${mq.lg} {
      flex: 0 0 ${($spanLg / 12) * 100}%;
      max-width: ${($spanLg / 12) * 100}%;
    }`}

  ${({ $spanXl }) =>
    $spanXl &&
    `${mq.xl} {
      flex: 0 0 ${($spanXl / 12) * 100}%;
      max-width: ${($spanXl / 12) * 100}%;
    }`}
`;
