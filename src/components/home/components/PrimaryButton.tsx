'use client';

import styled from 'styled-components';
import { colors, motion } from '@/styles/tokens';
import { ButtonBase } from './ButtonBase';

export function PrimaryButton({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <StyledPrimaryButton {...props}>{children}</StyledPrimaryButton>;
}

const StyledPrimaryButton = styled(ButtonBase)`
  background: ${colors.white};
  color: ${colors.textPrimary};
  border: none;
`;
