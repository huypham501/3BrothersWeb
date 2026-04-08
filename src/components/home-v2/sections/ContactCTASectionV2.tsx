'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

export function ContactCTASectionV2() {
  // 22 beams as in the design (Rectangle 27 through 48)
  // Each beam is 134px wide, 590px tall, spaced 66px apart with a step-down in top
  const beams = Array.from({ length: 22 }, (_, i) => {
    // Left half (0-10): starts at x=0, top=2224 stepping down -20px each
    // Right half (11-21): starts at x=726, top=2014 stepping up +20px each
    // We normalise relative to the container: left portion starts top=210, right mirrors
    if (i <= 10) {
      const left = i * 66;
      const top = 210 - i * 20; // decreasing top (going up-right)
      return { left, top };
    } else {
      const j = i - 11;
      const left = 726 + j * 66;
      const top = 0 + j * 30; // increasing top (going down-right)
      return { left, top };
    }
  });

  return (
    <SectionContainer>
      {/* Ambient blurs */}
      <AmbientBlur7 />
      <AmbientBlur8 />

      {/* Diagonal beam overlay */}
      <BeamsOverlay>
        {beams.map((b, i) => (
          <Beam key={i} style={{ left: b.left, top: b.top }} />
        ))}
      </BeamsOverlay>

      <ContentBlock>
        <Title>Đừng ngần ngại&nbsp;liên hệ</Title>
        <Subtitle>
          3Brothers Media với sứ mệnh trở thành cầu nối tin cậy giữa các nhãn hàng và các nhà sáng tạo nội dung (KOLs).
          Chúng tôi tôn trọng cá tính, màu sắc riêng biệt của từng KOL.
        </Subtitle>
        <ButtonWrapper>
          <ContactButton href="#">
            Liên hệ tư vấn
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </ContactButton>
        </ButtonWrapper>
      </ContentBlock>
    </SectionContainer>
  );
}

/* ─── Styled Components ─────────────────────────────────────────── */

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  padding: 120px ${spacing['5xl']};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  background: ${colors.primaryLight};

  ${mediaQueries.down.sm} {
    padding: 80px ${spacing.lg};
  }
`;

/* Ellipse 7 — large deep blue blur at top */
const AmbientBlur7 = styled.div`
  position: absolute;
  width: 1543px;
  height: 624px;
  left: -27px;
  top: 0;
  background: #003CA6;
  opacity: 0.7;
  filter: blur(200px);
  pointer-events: none;
  z-index: 0;
`;

/* Ellipse 8 — smaller dark blur at bottom-left */
const AmbientBlur8 = styled.div`
  position: absolute;
  width: 335px;
  height: 366px;
  left: 24px;
  bottom: 0;
  background: #061530;
  opacity: 0.4;
  filter: blur(200px);
  pointer-events: none;
  z-index: 0;
`;

/* Beam container with mix-blend-mode overlay */
const BeamsOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  overflow: hidden;
  z-index: 1;
`;

const Beam = styled.div`
  position: absolute;
  width: 134px;
  height: 590px;
  background: linear-gradient(222.85deg, rgba(255, 255, 255, 0) 49.5%, rgba(255, 255, 255, 0.6) 100%);
  filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.25));
`;

const ContentBlock = styled.div`
  position: relative;
  z-index: 10;
  max-width: 957px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  ${mediaQueries.down.sm} {
    gap: ${spacing.xl};
  }
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 120%;
  text-transform: uppercase;
  text-align: center;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 48px;
  }

  ${mediaQueries.down.sm} {
    font-size: 36px;
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
  max-width: 909px;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize.base};
  }
`;

const ButtonWrapper = styled.div`
  filter: drop-shadow(0px 0px 12px rgba(6, 21, 48, 0.6));
`;

const ContactButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  background: ${colors.white};
  border-radius: 48px;
  color: #061530;
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  white-space: nowrap;
  transition: opacity ${motion.duration.base};

  &:hover {
    opacity: 0.85;
  }
`;
