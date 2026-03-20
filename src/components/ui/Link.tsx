'use client';

/**
 * Link Component
 * Styled links with variants
 */

import styled, { css } from 'styled-components';

interface LinkProps {
  $variant?: 'default' | 'gradient' | 'gradient-2' | 'ui';
  $underline?: boolean;
}


export const Link = styled.a<LinkProps>`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  transition: all ${({ theme }) => `${theme.motion.duration.fast} ${theme.motion.easing.easeInOut}`};

  ${({ $underline = true }) =>
    $underline &&
    css`
      text-decoration: underline;
    `}

  ${({ $variant }) =>
    $variant === 'gradient' &&
    css`
      background: linear-gradient(
        89.97deg,
        ${({ theme }) => theme.colors.primary} 0.02%,
        ${({ theme }) => theme.colors.secondary} 138.52%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;

      &:hover {
        opacity: 0.8;
      }
    `}

  ${({ $variant }) =>
    $variant === 'gradient-2' &&
    css`
      background: linear-gradient(
        180deg,
        ${({ theme }) => theme.colors.secondary} 0%,
        ${({ theme }) => theme.colors.primary} 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;

      &:hover {
        opacity: 0.8;
      }
    `}

  ${({ $variant }) =>
    $variant === 'ui' &&
    css`
      color: ${({ theme }) => theme.colors.textPrimary};
      text-decoration: none;

      &:hover {
        color: ${({ theme }) => theme.colors.primary};
      }
    `}

  &:hover {
    ${({ $variant }) =>
      !$variant &&
      css`
        color: ${({ theme }) => theme.colors.primary};
      `}
  }
`;

export const TextGradient = styled.span<{ $variant?: 'gradient' | 'gradient-2' }>`
  background: ${({ $variant = 'gradient', theme }) =>
    $variant === 'gradient'
      ? `linear-gradient(89.97deg, ${theme.colors.primary} 0.02%, ${theme.colors.secondary} 138.52%)`
      : `linear-gradient(180deg, ${theme.colors.secondary} 0%, ${theme.colors.primary} 100%)`};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
