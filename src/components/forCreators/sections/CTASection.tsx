'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import { ForCreatorsCtaPayload } from '@/lib/cms/types';

export function CTASection({ content }: { content: ForCreatorsCtaPayload }) {
  return (
    <SectionContainer>
      <EllipseBlur1 />
      <EllipseBlur2 />
      <BlobLeft />
      <BlobRight />
      <StripeOverlay />

      <Inner>
        <ContentBox>
          <Heading dangerouslySetInnerHTML={{ __html: content.heading.replace(/\n/g, '<br />') }} />
          <Subtitle>{content.subtitle}</Subtitle>
        </ContentBox>

        <ButtonWrapper>
          <JoinButton href={content.cta_url}>
            {content.cta_label}
            <ArrowIcon>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833"
                  stroke="#061530"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ArrowIcon>
          </JoinButton>
        </ButtonWrapper>
      </Inner>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 540px;
  background: ${colors.primaryLight};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQueries.down.lg} {
    min-height: 440px;
  }

  ${mediaQueries.down.sm} {
    min-height: 360px;
  }
`;

const EllipseBlur1 = styled.div`
  position: absolute;
  width: 107%;
  height: 624px;
  left: -2%;
  bottom: -161px;
  background: ${colors.primary};
  opacity: 0.7;
  filter: blur(200px);
  pointer-events: none;
`;

const EllipseBlur2 = styled.div`
  position: absolute;
  width: 335px;
  height: 366px;
  left: 24px;
  bottom: -266px;
  background: ${colors.secondaryDark};
  opacity: 0.4;
  filter: blur(200px);
  pointer-events: none;
`;

const BlobRight = styled.div`
  position: absolute;
  width: 60%;
  height: 60%;
  right: -10%;
  bottom: -20%;
  background: #83B0FF;
  opacity: 0.8;
  filter: blur(160px);
  transform: matrix(-0.95, 0.3, -0.18, -0.98, 0, 0);
  pointer-events: none;
`;

const BlobLeft = styled.div`
  position: absolute;
  width: 60%;
  height: 60%;
  left: -10%;
  top: -20%;
  background: #83B0FF;
  opacity: 0.8;
  filter: blur(160px);
  transform: matrix(0.95, -0.3, 0.18, 0.98, 0, 0);
  pointer-events: none;
`;

const StripeOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    -68deg,
    transparent 0px,
    transparent 94px,
    rgba(255, 255, 255, 0.18) 94px,
    rgba(255, 255, 255, 0.18) 134px
  );
  mix-blend-mode: overlay;
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding: 100px ${spacing['5xl']};

  ${mediaQueries.down.lg} {
    padding: 80px ${spacing.xl};
  }

  ${mediaQueries.down.sm} {
    padding: 60px ${spacing.lg};
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 952px;
  width: 100%;
`;

const Heading = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 56px;
  line-height: 120%;
  text-align: center;
  text-transform: uppercase;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.lg} {
    font-size: 40px;
  }

  ${mediaQueries.down.sm} {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  text-align: center;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.sm} {
    font-size: 14px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0px 0px 12px rgba(6, 21, 48, 0.6));
`;

const JoinButton = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  height: 54px;
  background: ${colors.white};
  border-radius: 48px;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.secondaryDark};

  &:hover {
    background: #f0f4ff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ArrowIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;
