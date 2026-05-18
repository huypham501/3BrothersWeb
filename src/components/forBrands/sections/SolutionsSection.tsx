'use client';

import styled from 'styled-components';

import { colors, mediaQueries, spacing, typography } from '@/styles/tokens';
import { ForBrandsViewModel } from '../ForBrandsView';

export function SolutionsSection({ content }: { content: ForBrandsViewModel['solutions'] }) {
  const [topLeft, topRight, bottomLeft, bottomRight] = content.items;

  return (
    <SectionContainer>
      <Inner>
        <Title>{content.title}</Title>

        <Diagram>
          <SolutionCard $area="topLeft">{topLeft}</SolutionCard>
          <SolutionCard $area="topRight">{topRight}</SolutionCard>

          <CenterLogoFrame $area="center" aria-label="Center logo placeholder">
            <CenterLogoPlaceholder>Logo Placeholder</CenterLogoPlaceholder>
          </CenterLogoFrame>

          <SolutionCard $area="bottomLeft">{bottomLeft}</SolutionCard>
          <SolutionCard $area="bottomRight">{bottomRight}</SolutionCard>
        </Diagram>
      </Inner>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  background: #eceff6;
  padding: 120px 0;

  ${mediaQueries.down.lg} {
    padding: 80px 0;
  }

  ${mediaQueries.down.sm} {
    padding: 56px 0;
  }
`;

const Inner = styled.div`
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;

  ${mediaQueries.down.sm} {
    padding: 0 16px;
    gap: 40px;
  }
`;

const Title = styled.h2`
  margin: 0;
  width: min(909px, 100%);
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['6xl']};
  line-height: 140%;
  text-align: center;
  text-transform: uppercase;
  color: ${colors.secondaryDark};

  ${mediaQueries.down.sm} {
    font-size: 32px;
  }
`;

const Diagram = styled.div`
  position: relative;
  width: min(1280px, 100%);
  min-height: 472px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'topLeft topRight'
    'center center'
    'bottomLeft bottomRight';
  gap: 32px;
  align-items: center;

  ${mediaQueries.down.lg} {
    grid-template-columns: 1fr;
    grid-template-areas:
      'topLeft'
      'topRight'
      'center'
      'bottomLeft'
      'bottomRight';
    min-height: 0;
  }
`;

const CenterLogoFrame = styled.div<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
  justify-self: center;
  width: min(515px, 100%);
  aspect-ratio: 515 / 128;
  min-height: 96px;
`;

const CenterLogoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 44px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  background: linear-gradient(135deg, #0b49b7 0%, #003ca6 100%);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.semibold};
  font-size: 18px;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  ${mediaQueries.down.sm} {
    font-size: 14px;
  }
`;

const SolutionCard = styled.div<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
  width: 100%;
  max-width: 515px;
  justify-self: center;
  height: 128px;
  border-radius: 44px;
  background: ${colors.white};
  box-shadow: 0px 4px 24px rgba(6, 21, 48, 0.04);
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.secondaryDark};

  &::before {
    content: '→';
    width: 80px;
    height: 80px;
    border-radius: 24px;
    background: rgba(180, 207, 255, 0.2);
    color: ${colors.primary};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    line-height: 1;
    flex-shrink: 0;
  }

  ${mediaQueries.down.sm} {
    height: auto;
    min-height: 112px;
    font-size: 22px;
    padding: 16px 20px;
    gap: ${spacing.md};

    &::before {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      font-size: 34px;
    }
  }
`;
