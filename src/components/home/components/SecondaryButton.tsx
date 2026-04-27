'use client';

import styled from 'styled-components';
import { colors, motion } from '@/styles/tokens';
import { ButtonBase } from './ButtonBase';

export function SecondaryButton({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <StyledSecondaryButton {...props}>{children}</StyledSecondaryButton>;
}

const StyledSecondaryButton = styled(ButtonBase)`
  background: transparent;
  color: ${colors.white};
  border: 1px solid ${colors.white};
`;
