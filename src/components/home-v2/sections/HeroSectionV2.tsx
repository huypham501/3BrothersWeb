'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

export function HeroSectionV2() {
  return (
    <HeroContainer>
      <GlowEffect />
      <ContentWrapper>
        <TextBlock>
          <Title>Đồng hành để<br />cùng thành<br />công</Title>
          <SubText>
            3Brothers Media cung cấp giải pháp phù hợp và hiệu quả cho nhãn hàng dựa trên sự thấu hiểu - tôn trọng màu sắc Talent.
          </SubText>
          <ButtonGroup>
            <PrimaryButton href="#">
              Liên hệ tư vấn
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </PrimaryButton>
            <SecondaryButton href="#">Xem portfolio</SecondaryButton>
          </ButtonGroup>
        </TextBlock>
        <ImagePlaceholder />
      </ContentWrapper>
    </HeroContainer>
  );
}

const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 800px;
  background: linear-gradient(0deg, ${colors.bgDark}, ${colors.bgDark}), linear-gradient(180deg, ${colors.primaryLight} 0%, ${colors.primary} 100%);
  border-radius: 0 0 120px 120px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 ${spacing['5xl']};
  color: ${colors.white};

  ${mediaQueries.down.lg} {
    padding: 0 ${spacing['3xl']};
  }

  ${mediaQueries.down.sm} {
    min-height: 100vh;
    padding: ${spacing['2xl']} ${spacing.lg};
    border-radius: 0 0 60px 60px;
  }
`;

const GlowEffect = styled.div`
  position: absolute;
  width: 1064px;
  height: 585px;
  left: -30px;
  top: 406px;
  background: ${colors.primary};
  filter: blur(50px);
  z-index: 0;

  ${mediaQueries.down.sm} {
    width: 600px;
    height: 400px;
    top: 30%;
    left: -100px;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1440px;
  margin: ${spacing['4xl']} auto 0;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    gap: ${spacing['3xl']};
    align-items: center;
    text-align: center;
  }
`;

const TextBlock = styled.div`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};

  ${mediaQueries.down.lg} {
    align-items: center;
    width: 100%;
  }
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 120%;
  text-transform: uppercase;
  margin: ${spacing[0]};

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['5xl']};
  }
`;

const SubText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  margin: ${spacing[0]};
  opacity: 0.9;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize.base};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;

  ${mediaQueries.down.sm} {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px ${spacing.lg};
  gap: ${spacing.xs};
  background: ${colors.white};
  border-radius: ${borderRadius.xl};
  color: ${colors.primary};
  text-decoration: none;
  font-weight: ${typography.fontWeight.semibold};
  font-family: 'Inter', sans-serif;
  font-size: ${typography.fontSize.md};
  transition: opacity ${motion.duration.base};

  ${mediaQueries.down.sm} {
    width: 100%;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const SecondaryButton = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px ${spacing.lg};
  gap: ${spacing.xs};
  background: transparent;
  border: 1px solid ${colors.white};
  border-radius: ${borderRadius.xl};
  color: ${colors.white};
  text-decoration: none;
  font-weight: ${typography.fontWeight.semibold};
  font-family: 'Inter', sans-serif;
  font-size: ${typography.fontSize.md};
  transition: background ${motion.duration.base};

  ${mediaQueries.down.sm} {
    width: 100%;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ImagePlaceholder = styled.div`
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
