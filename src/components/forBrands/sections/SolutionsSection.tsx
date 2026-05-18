'use client';

import styled from 'styled-components';

import { colors, mediaQueries, spacing, typography } from '@/styles/tokens';
import { ForBrandsViewModel } from '../ForBrandsView';

const ARROW_PATH = 'M10 24H38M24 38L38 24L24 10';
const LEFT_CONNECTOR_PATHS = [
  'M223.334 78.666C223.334 80.1388 222.14 81.3327 220.667 81.3327C219.194 81.3327 218 80.1388 218 78.666C218 77.1933 219.194 75.9994 220.667 75.9994C222.14 75.9994 223.334 77.1933 223.334 78.666ZM5.33366 2.66602C5.33366 4.13877 4.13976 5.33268 2.66699 5.33268C1.19423 5.33268 0.000320435 4.13877 0.000320435 2.66602C0.000320435 1.19326 1.19423 -0.000651121 2.66699 -0.000651121C4.13976 -0.000651121 5.33366 1.19326 5.33366 2.66602ZM220.667 78.666V79.166H18.667V78.666V78.166H220.667V78.666ZM2.66699 62.666H2.16699V2.66602H2.66699H3.16699V62.666H2.66699ZM18.667 78.666V79.166C9.55429 79.166 2.16699 71.7787 2.16699 62.666H2.66699H3.16699C3.16699 71.2264 10.1066 78.166 18.667 78.166V78.666Z',
  'M223.334 78.666C223.334 77.1933 222.14 75.9993 220.667 75.9993C219.194 75.9993 218 77.1933 218 78.666C218 80.1388 219.194 81.3327 220.667 81.3327C222.14 81.3327 223.334 80.1388 223.334 78.666ZM5.33366 154.666C5.33366 153.193 4.13976 151.999 2.66699 151.999C1.19423 151.999 0.000320435 153.193 0.000320435 154.666C0.000320435 156.139 1.19423 157.333 2.66699 157.333C4.13976 157.333 5.33366 156.139 5.33366 154.666ZM220.667 78.666V78.166H18.667V78.666V79.166H220.667V78.666ZM2.66699 94.666H2.16699V154.666H2.66699H3.16699V94.666H2.66699ZM18.667 78.666V78.166C9.55429 78.166 2.16699 85.5533 2.16699 94.666H2.66699H3.16699C3.16699 86.1056 10.1066 79.166 18.667 79.166V78.666Z',
] as const;
const RIGHT_CONNECTOR_PATHS = [
  'M0.000325441 78.666C0.000325441 80.1388 1.19423 81.3327 2.66699 81.3327C4.13975 81.3327 5.33366 80.1388 5.33366 78.666C5.33366 77.1933 4.13975 75.9994 2.66699 75.9994C1.19423 75.9994 0.000325441 77.1933 0.000325441 78.666ZM218 2.66602C218 4.13877 219.194 5.33268 220.667 5.33268C222.14 5.33268 223.334 4.13877 223.334 2.66602C223.334 1.19326 222.14 -0.000651121 220.667 -0.000651121C219.194 -0.000651121 218 1.19326 218 2.66602ZM2.66699 78.666V79.166H204.667V78.666V78.166H2.66699V78.666ZM220.667 62.666H221.167V2.66602H220.667H220.167V62.666H220.667ZM204.667 78.666V79.166C213.78 79.166 221.167 71.7787 221.167 62.666H220.667H220.167C220.167 71.2264 213.227 78.166 204.667 78.166V78.666Z',
  'M0.000325441 78.666C0.000325441 77.1933 1.19423 75.9993 2.66699 75.9993C4.13975 75.9993 5.33366 77.1933 5.33366 78.666C5.33366 80.1388 4.13975 81.3327 2.66699 81.3327C1.19423 81.3327 0.000325441 80.1388 0.000325441 78.666ZM218 154.666C218 153.193 219.194 151.999 220.667 151.999C222.14 151.999 223.334 153.193 223.334 154.666C223.334 156.139 222.14 157.333 220.667 157.333C219.194 157.333 218 156.139 218 154.666ZM2.66699 78.666V78.166H204.667V78.666V79.166H2.66699V78.666ZM220.667 94.666H221.167V154.666H220.667H220.167V94.666H220.667ZM204.667 78.666V78.166C213.78 78.166 221.167 85.5533 221.167 94.666H220.667H220.167C220.167 86.1056 213.227 79.166 204.667 79.166V78.666Z',
] as const;

export function SolutionsSection({ content }: { content: ForBrandsViewModel['solutions'] }) {
  const [topLeft, topRight, bottomLeft, bottomRight] = content.items;
  const cards = [
    { area: 'topLeft', label: topLeft },
    { area: 'topRight', label: topRight },
    { area: 'bottomLeft', label: bottomLeft },
    { area: 'bottomRight', label: bottomRight },
  ] as const;

  return (
    <SectionContainer>
      <Inner>
        <Title>{content.title}</Title>

        <Diagram>
          {cards.slice(0, 2).map((card) => (
            <SolutionCard key={card.area} $area={card.area}>
              <CardArrow aria-hidden="true">
                <CardArrowIcon viewBox="0 0 48 48" fill="none">
                  <path
                    d={ARROW_PATH}
                    stroke="#003CA6"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </CardArrowIcon>
              </CardArrow>
              <CardLabel>{card.label}</CardLabel>
            </SolutionCard>
          ))}

          <LeftConnectorWrapper aria-hidden="true">
            <ConnectorShape viewBox="0 0 224 158" fill="none">
              {LEFT_CONNECTOR_PATHS.map((d, idx) => (
                <path key={idx} d={d} fill="#83B0FF" />
              ))}
            </ConnectorShape>
          </LeftConnectorWrapper>
          <RightConnectorWrapper aria-hidden="true">
            <ConnectorShape viewBox="0 0 224 158" fill="none">
              {RIGHT_CONNECTOR_PATHS.map((d, idx) => (
                <path key={idx} d={d} fill="#83B0FF" />
              ))}
            </ConnectorShape>
          </RightConnectorWrapper>

          <CenterLogoFrame $area="center" aria-label="Center logo placeholder">
            <CenterLogoPlaceholder>Logo Placeholder</CenterLogoPlaceholder>
          </CenterLogoFrame>

          {cards.slice(2).map((card) => (
            <SolutionCard key={card.area} $area={card.area}>
              <CardArrow aria-hidden="true">
                <CardArrowIcon viewBox="0 0 48 48" fill="none">
                  <path
                    d={ARROW_PATH}
                    stroke="#003CA6"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </CardArrowIcon>
              </CardArrow>
              <CardLabel>{card.label}</CardLabel>
            </SolutionCard>
          ))}
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
  font-family: ${typography.fontFamily.montserrat};
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
  grid-template-columns: 515px 515px;
  grid-template-areas:
    'topLeft topRight'
    'center center'
    'bottomLeft bottomRight';
  column-gap: 250px;
  row-gap: 32px;
  justify-content: center;
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

const LeftConnectorWrapper = styled.div`
  position: absolute;
  top: calc(50% - 76px);
  left: calc(50% - 450.665px);
  width: 218px;
  height: 152px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  ${mediaQueries.down.lg} {
    display: none;
  }
`;

const RightConnectorWrapper = styled.div`
  position: absolute;
  top: calc(50% - 76px);
  right: calc(50% - 450.665px);
  width: 218px;
  height: 152px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  ${mediaQueries.down.lg} {
    display: none;
  }
`;

const ConnectorShape = styled.svg`
  width: 224px;
  height: 158px;
  transform-origin: top left;
  transform: scaleX(0.9732142857) scaleY(0.9620253165);
`;

const CenterLogoFrame = styled.div<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
  justify-self: center;
  width: min(405.33px, 100%);
  aspect-ratio: 405.33 / 152;
  min-height: 152px;
`;

const CenterLogoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 44px;
  background: linear-gradient(135deg, #0b49b7 0%, #003ca6 100%);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.fontFamily.montserrat};
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
  border: 1px solid transparent;
  background:
    linear-gradient(${colors.white}, ${colors.white}) padding-box,
    linear-gradient(
        102deg,
        rgba(180, 207, 255, 0.4) 0%,
        rgba(108, 124, 153, 0.32) 100%
      )
      border-box;
  box-shadow: 0px 4px 24px rgba(6, 21, 48, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px 32px;

  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.secondaryDark};

  ${mediaQueries.down.sm} {
    height: auto;
    min-height: 112px;
    font-size: 22px;
    padding: 16px 20px;
    gap: ${spacing.md};
  }
`;

const CardArrow = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: rgba(180, 207, 255, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${mediaQueries.down.sm} {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }
`;

const CardArrowIcon = styled.svg`
  width: 48px;
  height: 48px;
  flex-shrink: 0;

  ${mediaQueries.down.sm} {
    width: 34px;
    height: 34px;
  }
`;

const CardLabel = styled.span`
  display: inline-block;
`;
