'use client';

/**
 * Button Component
 * Reusable button with variants
 */

import styled, { css } from 'styled-components';
import { mq } from '@/styles/mediaQueries';

type ButtonVariant = 'primary' | 'gradient' | 'outline' | 'outlineLight' | 'clear';
type ButtonSize = 'sm' | 'base' | 'xl';

interface ButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $rounded?: boolean;
  $fullWidth?: boolean;
}

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.primary};

    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.colors.primaryHover};
      color: ${({ theme }) => theme.colors.white};
    }
  `,

  gradient: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border: none;

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }
  `,

  outline: css`
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};

    &:hover,
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.white};
    }
  `,

  outlineLight: css`
    border: 1px solid ${({ theme }) => theme.colors.white};
    background-color: transparent;
    color: ${({ theme }) => theme.colors.white};

    &:hover,
    &:focus {
      border-color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.primary};

      span {
        background: linear-gradient(89.97deg, ${({ theme }) => theme.colors.primary} 0.02%, ${({ theme }) => theme.colors.primaryLight} 138.52%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  `,

  clear: css`
    border: none;
    background-color: transparent;
    padding: 0;
  `,
};

const sizeStyles = {
  sm: css`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    line-height: 24px;
    padding: 8px 24px;
  `,

  base: css`
    font-size: 1rem;
    padding: 8px 24px;
  `,

  xl: css`
    line-height: 28px;
    padding: 18px 62px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};

    ${mq.md} {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
    }
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-block;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  transition: color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.easeInOut},
    background-color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.easeInOut},
    border-color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.easeInOut},
    box-shadow ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.easeInOut};

  /* Variant styles */
  ${({ $variant = 'primary' }) => variantStyles[$variant]}

  /* Size styles */
  ${({ $size = 'base' }) => sizeStyles[$size]}

  /* Rounded */
  ${({ $rounded }) =>
    $rounded &&
    css`
      border-radius: ${({ theme }) => theme.borderRadius.round};
    `}

  /* Full width */
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
