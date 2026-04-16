'use client';

import styled from 'styled-components';

interface StripeOverlayProps {
  opacity?: number;
}

export const StripeOverlay = styled.div<StripeOverlayProps>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    -68deg,
    transparent 0px,
    transparent 94px,
    rgba(255, 255, 255, ${({ opacity = 0.22 }) => opacity}) 94px,
    rgba(255, 255, 255, ${({ opacity = 0.22 }) => opacity}) 134px
  );
  mix-blend-mode: overlay;
  z-index: 1;
`;
