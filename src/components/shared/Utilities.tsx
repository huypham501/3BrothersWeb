'use client';

/**
 * Utility Components
 * Misc utility components like badges, dividers, etc.
 */

import styled from 'styled-components';
import { mq } from '@/styles/mediaQueries';

// Display utilities
// Aspect ratio box (for maintaining aspect ratios)

export const Divider = styled.hr<{ $spacing?: 'sm' | 'md' | 'lg' }>`
  margin: ${({ $spacing = 'md' }) => {
    switch ($spacing) {
      case 'sm':
        return '1rem 0';
      case 'lg':
        return '3rem 0';
      default:
        return '2rem 0';
    }
  }};
  color: inherit;
  background-color: currentColor;
  border: 0;
  opacity: 0.25;
  height: 1px;
`;

export const Gaps = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
  margin-bottom: 48px;
  margin-top: 48px;

  ${mq.md} {
    margin-top: 88px;
    margin-bottom: 88px;
  }

  ${mq.lg} {
    margin-top: 120px;
    margin-bottom: 112px;
  }
`;

export const Badge = styled.span<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-block;
  padding: 0.25em 0.5em;
  font-size: 0.875em;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background-color: ${({ $variant = 'primary', theme }) =>
    $variant === 'primary' ? theme.colors.primary : theme.colors.secondary};
`;

export const TextPrimary = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export const TextGradientSpan = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  
  &.text-gradient-2 {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const RelativeWrapper = styled.div`
  position: relative;
`;

export const ImageWrapper = styled.div<{ $rounded?: boolean; $aspectRatio?: string }>`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: ${({ $rounded, theme }) =>
    $rounded ? theme.borderRadius.lg : 0};

  ${({ $aspectRatio }) =>
    $aspectRatio &&
    `
    padding-bottom: ${$aspectRatio};
    height: 0;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `}
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export const ShowOnMobile = styled.div`
  display: block;

  ${mq.md} {
    display: none;
  }
`;

export const ShowOnTablet = styled.div`
  display: none;

  ${mq.md} {
    display: block;
  }

  ${mq.lg} {
    display: none;
  }
`;

export const ShowOnDesktop = styled.div`
  display: none;

  ${mq.lg} {
    display: block;
  }
`;

export const HideOnMobile = styled.div`
  display: none;

  ${mq.md} {
    display: block;
  }
`;

export const AspectRatio = styled.div<{ $ratio: string }>`
  position: relative;
  width: 100%;
  
  &::before {
    content: '';
    display: block;
    padding-bottom: ${({ $ratio }) => $ratio};
  }

  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
