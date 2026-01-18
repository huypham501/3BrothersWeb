'use client';

/**
 * Section Component
 * Common section wrapper with consistent spacing
 */

import styled from 'styled-components';

interface SectionProps {
  $variant?: 'default' | 'compact' | 'large' | 'newsletter';
  $bgColor?: string;
  $noPadding?: boolean;
}

export const Section = styled.section<SectionProps>`
  background-color: ${({ $bgColor, theme }) => 
    $bgColor || theme.colors.white};
`;
