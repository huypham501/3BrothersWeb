'use client';

/**
 * Heading Components
 * Typography heading components with consistent styling
 */

import styled, { css } from 'styled-components';
import { mq } from '@/styles/mediaQueries';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingVariant = 'title' | 'title-2' | 'display';

interface HeadingProps {
  $variant?: HeadingVariant;
  $gradient?: boolean;
  $align?: 'left' | 'center' | 'right';
}

const baseHeadingStyles = css`
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 0.5rem;
`;

const titleStyles = css<HeadingProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  line-height: 1;
  color: ${({ theme }) => theme.colors.primary};

  ${({ $gradient }) =>
    $gradient &&
    css`
      span {
        color: ${({ theme }) => theme.colors.secondary};
        font-weight: ${({ theme }) => theme.typography.fontWeight.black};
      }
    `}
`;

const title2Styles = css`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1;
  color: ${({ theme }) => theme.colors.textSecondary};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const H1 = styled.h1<HeadingProps>`
  ${baseHeadingStyles}
  margin-top: 0;
  font-size: calc(1.375rem + 1.5vw);

  ${mq.xl} {
    font-size: 2.5rem;
  }

  ${({ $variant }) => {
    if ($variant === 'title') return titleStyles;
    if ($variant === 'title-2') return title2Styles;
    return '';
  }}

  text-align: ${({ $align = 'left' }) => $align};
`;

export const H2 = styled.h2<HeadingProps>`
  ${baseHeadingStyles}
  margin-top: 0;
  font-size: calc(1.325rem + 0.9vw);

  ${mq.xl} {
    font-size: 2rem;
  }

  ${({ $variant }) => {
    if ($variant === 'title') return titleStyles;
    if ($variant === 'title-2') return title2Styles;
    return '';
  }}

  text-align: ${({ $align = 'left' }) => $align};
`;

export const H3 = styled.h3<HeadingProps>`
  ${baseHeadingStyles}
  margin-top: 0;
  font-size: calc(1.3rem + 0.6vw);

  ${mq.xl} {
    font-size: 1.75rem;
  }

  ${({ $variant }) => {
    if ($variant === 'title') return titleStyles;
    if ($variant === 'title-2') return title2Styles;
    return '';
  }}

  text-align: ${({ $align = 'left' }) => $align};
`;

export const H4 = styled.h4<HeadingProps>`
  ${baseHeadingStyles}
  margin-top: 0;
  font-size: calc(1.275rem + 0.3vw);

  ${mq.xl} {
    font-size: 1.5rem;
  }

  ${({ $variant }) => {
    if ($variant === 'title') return titleStyles;
    if ($variant === 'title-2') return title2Styles;
    return '';
  }}

  text-align: ${({ $align = 'left' }) => $align};
`;

export const H5 = styled.h5<HeadingProps>`
  ${baseHeadingStyles}
  margin-top: 0;
  font-size: 1.25rem;

  ${({ $variant }) => {
    if ($variant === 'title') return titleStyles;
    if ($variant === 'title-2') return title2Styles;
    return '';
  }}

  text-align: ${({ $align = 'left' }) => $align};
`;

export const H6 = styled.h6<HeadingProps>`
  ${baseHeadingStyles}
  margin-top: 0;
  font-size: 1rem;

  ${({ $variant }) => {
    if ($variant === 'title') return titleStyles;
    if ($variant === 'title-2') return title2Styles;
    return '';
  }}

  text-align: ${({ $align = 'left' }) => $align};
`;

// Utility component for section headings
export const SectionHeading = styled.div<{ $marginBottom?: string }>`
  margin-bottom: ${({ $marginBottom = '48px' }) => $marginBottom};

  ${mq.lg} {
    margin-bottom: ${({ $marginBottom = '80px' }) => $marginBottom};
  }
`;
