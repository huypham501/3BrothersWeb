'use client';

import styled from 'styled-components';
import { mediaQueries, typography, spacing } from '@/styles/tokens';

export function HeroMediaPlaceholder() {
  return (
    <PlaceholderContainer />
  );
}

const PlaceholderContainer = styled.div`
  width: 100%;
  max-width: 480px;
  aspect-ratio: 480 / 560;
  background: linear-gradient(180deg, #A48B8B, #4C3C3C);
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
  margin-top: -360px;

  ${mediaQueries.down.lg} {
    margin-top: ${spacing.xl};
  }

  &::after {
    content: "L'Oreal Paris Image Placeholder";
    color: rgba(255,255,255,0.7);
    font-weight: ${typography.fontWeight.bold};
    font-family: 'Inter', sans-serif;
    text-align: center;
    padding: ${spacing.lg};
  }
`;
