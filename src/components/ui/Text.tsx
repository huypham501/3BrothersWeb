'use client';

/**
 * Text Component
 * Typography for body text with variants
 */

import styled, { css } from 'styled-components';
import { mq } from '@/styles/mediaQueries';

type TextVariant = 'body' | 'sub-title' | 'caption' | 'label';
type TextSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl';
type TextColor = 'primary' | 'secondary' | 'muted' | 'light' | 'white' | 'inherit';

interface TextProps {
  $variant?: TextVariant;
  $size?: TextSize;
  $color?: TextColor;
  $weight?: number;
  $align?: 'left' | 'center' | 'right';
  $lineHeight?: string | number;
}

const colorMap = {
  primary: (theme: any) => theme.colors.textPrimary,
  secondary: (theme: any) => theme.colors.textSecondary,
  muted: (theme: any) => theme.colors.textMuted,
  light: (theme: any) => theme.colors.textLight,
  white: (theme: any) => theme.colors.white,
  inherit: () => 'inherit',
};

export const Text = styled.p<TextProps>`
  margin-top: 0;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  line-height: ${({ $lineHeight, theme }) => 
    $lineHeight || theme.typography.lineHeight.body};

  /* Size */
  font-size: ${({ $size = 'base', theme }) => {
    switch ($size) {
      case 'xs': return theme.typography.fontSize.xs;
      case 'sm': return theme.typography.fontSize.sm;
      case 'base': return theme.typography.fontSize.base;
      case 'md': return theme.typography.fontSize.md;
      case 'lg': return theme.typography.fontSize.lg;
      case 'xl': return theme.typography.fontSize.xl;
      default: return theme.typography.fontSize.base;
    }
  }};

  /* Color */
  color: ${({ $color = 'primary', theme }) => colorMap[$color](theme)};

  /* Weight */
  font-weight: ${({ $weight = 400 }) => $weight};

  /* Align */
  text-align: ${({ $align = 'left' }) => $align};

  /* Variant-specific styles */
  ${({ $variant }) => {
    switch ($variant) {
      case 'sub-title':
        return css`
          max-width: 445px;
          margin-left: auto;
          margin-right: auto;
          margin-top: ${({ theme }) => theme.spacing.md};
          margin-bottom: 0;
          line-height: 1.7;
          color: ${({ theme }) => theme.colors.textLight};

          ${mq.md} {
            margin-top: ${({ theme }) => theme.spacing.lg};
          }

          ${mq.lg} {
            margin-top: ${({ theme }) => theme.spacing.xl};
            font-size: ${({ theme }) => theme.typography.fontSize.xl};
            line-height: 1.6;
            font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
            max-width: 592px;
          }
        `;
      
      case 'caption':
        return css`
          font-size: ${({ theme }) => theme.typography.fontSize.sm};
          line-height: 1.69;
          color: ${({ theme }) => theme.colors.textMuted};
          font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
        `;
      
      case 'label':
        return css`
          font-size: ${({ theme }) => theme.typography.fontSize.sm};
          font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
          text-transform: uppercase;
          margin-bottom: 0;
        `;
      
      default:
        return '';
    }
  }}
`;

export const MainText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.69;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  margin-left: auto;
  margin-right: auto;
  max-width: 780px;

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    line-height: 1.625;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;
