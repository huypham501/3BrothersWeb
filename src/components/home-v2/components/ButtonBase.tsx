'use client';

import styled from 'styled-components';
import { spacing, typography, borderRadius, mediaQueries } from '@/styles/tokens';

export const ButtonBase = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 ${spacing.lg};
  height: 52px;
  gap: ${spacing.xs};
  border-radius: ${borderRadius.xl};
  text-decoration: none;
  font-weight: ${typography.fontWeight.semibold};
  font-family: 'Inter', sans-serif;
  font-size: ${typography.fontSize.md};
  line-height: 1;
  box-sizing: border-box;
  cursor: pointer;

  ${mediaQueries.down.sm} {
    width: 100%;
  }
`;
