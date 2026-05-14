'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';
import type { SocialCommerceHeroPayload } from '@/lib/cms/types';

const HERO_BG_IMAGE = '/images/social-commerce/hero-background.png';
const HERO_BG_ASPECT_RATIO = '1440 / 471';
const HERO_BG_WIDTH = '1440px';

// ── Component ─────────────────────────────────────────────────────────────────

export function HeroSection({ content }: { content: SocialCommerceHeroPayload }) {
  return (
    <SectionContainer>
      <BackgroundLayer aria-hidden="true" />

      <Inner>
        <HeaderContent>
          <EyebrowGroup>
            <EyebrowText>{content.eyebrow}</EyebrowText>
          </EyebrowGroup>
          
          <Title>{content.title}</Title>
          
          <ContentLower>
            <Subtitle>{content.subtitle}</Subtitle>
            
            <ServicesRow>
              {content.services.map((service) => (
                <ServicePill key={service.id}>
                  <ServiceText>{service.label}</ServiceText>
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

const BackgroundLayer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  width: ${HERO_BG_WIDTH};
  height: auto;
  aspect-ratio: ${HERO_BG_ASPECT_RATIO};
  transform: translateX(-50%);
  background-image: url('${HERO_BG_IMAGE}');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;
  -webkit-mask-image:
    linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, black 12%, black 100%);
  mask-image:
    linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, black 12%, black 100%);
  -webkit-mask-repeat: no-repeat, no-repeat;
  mask-repeat: no-repeat, no-repeat;
  -webkit-mask-size: 100% 100%, 100% 100%;
  mask-size: 100% 100%, 100% 100%;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
  pointer-events: none;
  z-index: 0;

  ${mediaQueries.down.sm} {
    background-position: center -20px;
  }
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
