'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';

// ── Data ──────────────────────────────────────────────────────────────────────

const BEAMS = Array.from({ length: 22 }, (_, i) => {
  return { left: -40 + i * 66 };
});

const SERVICES = [
  'Live Commerce',
  'Affiliate Marketing',
  'KOL Marketplace',
  'Bio Link',
  'Brand Partnerships'
];

// ── Component ─────────────────────────────────────────────────────────────────

export function HeroSection() {

  return (
    <SectionContainer>
      <Ellipse15 />
      <Ellipse16 />

      <BeamsOverlay>
        {BEAMS.map((b, i) => {
          // Bottom positions loosely matching design staggered layout
          // Center beams are higher up (lower bottom px value or negative)
          let bottom = -219 + i * 20;
          if (i > 10) bottom = bottom - (i - 10) * 40; 

          return <Beam key={i} style={{ left: b.left, bottom: `${bottom}px` }} />;
        })}
      </BeamsOverlay>

      <Inner>
        <HeaderContent>
          <EyebrowGroup>
            <EyebrowText>Dịch vụ</EyebrowText>
          </EyebrowGroup>
          
          <Title>Social Commerce</Title>
          
          <ContentLower>
            <Subtitle>Giải pháp gia tăng thu nhập cho Creator & KOLs</Subtitle>
            
            <ServicesRow>
              {SERVICES.map((service, idx) => (
                <ServicePill key={idx}>
                  <ServiceText>{service}</ServiceText>
                </ServicePill>
              ))}
            </ServicesRow>
          </ContentLower>
        </HeaderContent>
      </Inner>
    </SectionContainer>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

/* Container */
const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  height: 471px;
  background: #061530;
  display: flex;
  overflow: hidden;

  ${mediaQueries.down.lg} {
    height: auto;
    padding: 120px 0 80px;
  }
`;

/* Deep blur effects */
const Ellipse15 = styled.div`
  position: absolute;
  width: 1521px;
  height: 458px;
  left: -41px;
  bottom: -217px;
  background: #003085;
  filter: blur(120px);
  pointer-events: none;
`;

const Ellipse16 = styled.div`
  position: absolute;
  width: 1201px;
  height: 228px;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px;
  background: #003CA6;
  filter: blur(120px);
  pointer-events: none;
`;

/* Overlay Beams */
const BeamsOverlay = styled.div`
  position: absolute;
  width: 1520px;
  height: 800px;
  left: 50%;
  transform: translateX(-50%);
  top: -110px;
  mix-blend-mode: overlay;
  pointer-events: none;
`;

const Beam = styled.div`
  position: absolute;
  width: 134px;
  height: 590px;
  background: linear-gradient(222.85deg, rgba(255, 255, 255, 0) 49.5%, rgba(255, 255, 255, 0.9) 100%);
  filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.25));
`;

/* Inner Layout */
const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 170px 84px 80px;

  ${mediaQueries.down.lg} {
    padding: 0 40px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 20px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  max-width: 1272px;
`;

/* Eyebrow */
const EyebrowGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0;
  gap: 8px;
`;

const EyebrowText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: rgba(255, 255, 255, 0.5);
`;

/* Title */
const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 140%;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.lg} {
    font-size: 48px;
  }

  ${mediaQueries.down.sm} {
    font-size: 36px;
  }
`;

/* Content Lower */
const ContentLower = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  margin-top: 10px;
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: ${colors.white};
  margin: 0;
`;

/* Services row */
const ServicesRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0 0;
  gap: 16px;
  flex-wrap: wrap;
`;

const ServicePill = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 20px;
  gap: 4px;
  height: 34px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 40px;
  white-space: nowrap;
`;

const ServiceText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  display: flex;
  align-items: center;
  color: #F0F4FF;
`;
