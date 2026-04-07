'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

// ── Component ─────────────────────────────────────────────────────────────────

export function ForCreatorsCTASection() {
  return (
    <SectionContainer>
      {/* Background decorative layers */}
      <EllipseBlur1 />
      <EllipseBlur2 />
      <BlobLeft />
      <BlobRight />
      <StripeOverlay />

      {/* Content */}
      <Inner>
        <ContentBox>
          <Heading>
            Sẵn Sàng Bắt Đầu
            <br />
            Hành Trình Cùng Chúng Tôi?
          </Heading>

          <Subtitle>
            Đăng ký ngay hôm nay để trở thành một phần của cộng đồng creator hàng đầu Việt Nam.
          </Subtitle>
        </ContentBox>

        <ButtonWrapper>
          <JoinButton href="/contact">
            Gia nhập 3Brothers
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

// ── Styled components ─────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 540px;
  background: ${colors.primaryLight}; /* #6395ED */
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

/* Large navy ellipse bottom-center — opacity 0.7, blur 200px */
const EllipseBlur1 = styled.div`
  position: absolute;
  width: 107%;
  height: 624px;
  left: -2%;
  bottom: -161px;
  background: ${colors.primary}; /* #003CA6 */
  opacity: 0.7;
  filter: blur(200px);
  pointer-events: none;
`;

/* Small dark ellipse bottom-left — opacity 0.4, blur 200px */
const EllipseBlur2 = styled.div`
  position: absolute;
  width: 335px;
  height: 366px;
  left: 24px;
  bottom: -266px;
  background: ${colors.secondaryDark}; /* #061530 */
  opacity: 0.4;
  filter: blur(200px);
  pointer-events: none;
`;

/* Light-blue blob bottom-right */
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

/* Light-blue blob top-left (mirrored) */
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

/* Diagonal stripe overlay — same pattern as Testimonials */
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

/* Centred flex column */
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

/* Title + subtitle stacked */
const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 952px;
  width: 100%;
`;

/* H2 — Montserrat 700 56px white uppercase */
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

/* Subtitle — 16px white */
const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md}; /* 16px */
  line-height: 140%;
  text-align: center;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.sm} {
    font-size: 14px;
  }
`;

/* CTA button row */
const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0px 0px 12px rgba(6, 21, 48, 0.6));
`;

/* White pill button "Gia nhập 3Brothers →" */
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
  color: ${colors.secondaryDark}; /* #061530 */

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
