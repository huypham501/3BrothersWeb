'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

export function ContactCTASectionV2() {
  return (
    <SectionContainer>
      <BeamsBackground />
      <ContentBlock>
        <Title>Đừng ngần ngại liên hệ</Title>
        <Subtitle>
          3Brothers Media với sứ mệnh trở thành cầu nối tin cậy giữa các nhãn hàng và các nhà sáng tạo nội dung (KOLs). Chúng tôi tôn trọng cá tính, màu sắc riêng biệt của từng KOL.
        </Subtitle>
        <ContactButton href="#">
          Liên hệ ngay
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </ContactButton>
      </ContentBlock>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  padding: 160px ${spacing['5xl']};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;

  /* Vibrant blue background as seen in the design */
  background: linear-gradient(180deg, ${colors.primaryLight} 0%, ${colors.primary} 100%);

  ${mediaQueries.down.sm} {
    padding: 80px ${spacing.lg};
  }
`;

const BeamsBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0px,
    rgba(255, 255, 255, 0) 80px,
    rgba(255, 255, 255, 0.4) 80px,
    rgba(255, 255, 255, 0.4) 82px
  );
`;

const ContentBlock = styled.div`
  z-index: 10;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.xl};

  ${mediaQueries.down.sm} {
    gap: ${spacing.lg};
  }
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 120%;
  text-transform: uppercase;
  color: ${colors.white};
  margin: ${spacing[0]};

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['5xl']};
  }
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: rgba(255, 255, 255, 0.9);
  margin: ${spacing[0]};
  max-width: 900px;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize.base};
  }
`;

const ContactButton = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${spacing.md} ${spacing.xl};
  gap: ${spacing.sm};
  background: ${colors.white};
  border-radius: ${borderRadius.round};
  color: ${colors.primary};
  text-decoration: none;
  font-weight: ${typography.fontWeight.semibold};
  font-family: 'Inter', sans-serif;
  font-size: ${typography.fontSize.lg};
  transition: opacity ${motion.duration.base};

  &:hover {
    opacity: 0.8;
  }
`;
