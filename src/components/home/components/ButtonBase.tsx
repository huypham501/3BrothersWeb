'use client';

import styled from 'styled-components';
import { spacing, typography, borderRadius, mediaQueries } from '@/styles/tokens';

export const ButtonBase = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${spacing.md} ${spacing.xl};
  height: 54px;
  gap: ${spacing.sm};
  border-radius: ${borderRadius.xl};
  text-decoration: none;
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  box-sizing: border-box;
  cursor: pointer;

  ${mediaQueries.down.sm} {
    width: 100%;
  }
`;
