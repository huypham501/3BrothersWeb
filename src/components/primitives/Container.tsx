'use client';

/**
 * Container Component
 * Responsive container with max-width constraints
 */

import styled, { css } from 'styled-components';
import { mq } from '@/styles/mediaQueries';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'fluid';

interface ContainerProps {
  $size?: ContainerSize;
  $noPadding?: boolean;
}


export const Container = styled.div<ContainerProps>`
  width: 100%;
  padding-right: ${({ $noPadding }) => ($noPadding ? 0 : '15px')};
  padding-left: ${({ $noPadding }) => ($noPadding ? 0 : '15px')};
  margin-right: auto;
  margin-left: auto;

  ${({ $size }) => {
    if ($size === 'fluid') {
      return css`
        max-width: 100%;
      `;
    }

    // Default to responsive max-widths
    return css`
      ${mq.sm} {
        max-width: ${({ theme }) => 
          $size === 'sm' ? theme.containerWidths.sm : theme.containerWidths.sm};
      }

      ${mq.md} {
        max-width: ${({ theme }) =>
          $size === 'sm' || $size === 'md' 
            ? theme.containerWidths.md 
            : theme.containerWidths.md};
      }

      ${mq.lg} {
        max-width: ${({ theme }) =>
          $size === 'sm' || $size === 'md' || $size === 'lg'
            ? theme.containerWidths.lg
            : theme.containerWidths.lg};
      }

      ${mq.xl} {
        max-width: ${({ theme }) =>
          $size === 'xxl'
            ? theme.containerWidths.xl
            : theme.containerWidths.xl};
      }

      ${mq.custom} {
        max-width: ${({ theme }) => theme.containerWidths.xxl};
      }

      ${mq.xxl} {
        max-width: ${({ theme }) => theme.containerWidths.xxl};
      }
    `;
  }}
`;
