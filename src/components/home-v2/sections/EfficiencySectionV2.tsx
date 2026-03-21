'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

export function EfficiencySectionV2() {
  return (
    <SectionContainer>
      <TopHeader>
        <TextContent>
          <Title>Hiệu quả<br/>thực thi</Title>
          <Description>
            Chúng tôi cung cấp giải pháp Influencer Marketing & Talent Management chuyên nghiệp, giúp thương hiệu triển khai hiệu quả và xây dựng giá trị dài hạn.
          </Description>
        </TextContent>
        <ButtonGroup>
          <PrimaryButton href="#">
            Liên hệ tư vấn
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </PrimaryButton>
          <SecondaryButton href="#">Xem portfolio</SecondaryButton>
        </ButtonGroup>
      </TopHeader>

      <StatsCard>
        <StatItem>
          <StatNumber>30M+</StatNumber>
          <StatLabel>Lượt tiếp cận</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>30M+</StatNumber>
          <StatLabel>Video được sản xuất</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>30M+</StatNumber>
          <StatLabel>Lượt tiếp cận</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>30M+</StatNumber>
          <StatLabel>Lượt tiếp cận</StatLabel>
        </StatItem>
      </StatsCard>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  padding: 120px ${spacing['5xl']};
  display: flex;
  flex-direction: column;
  gap: ${spacing['5xl']};
  font-family: 'Montserrat', 'Inter', sans-serif;

  ${mediaQueries.down.sm} {
    padding: 60px ${spacing.lg};
    gap: ${spacing['2xl']};
  }
`;

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.xl};
  }
`;

const TextContent = styled.div`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const Title = styled.h2`
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 110%;
  text-transform: uppercase;
  color: ${colors.primary};
  margin: ${spacing[0]};

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['5xl']};
  }
`;

const Description = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 150%;
  color: ${colors.textBody};
  margin: ${spacing[0]};
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
  background: ${colors.primary};
  border-radius: ${borderRadius.xl};
  color: ${colors.white};
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
  border: 1px solid ${colors.primary};
  border-radius: ${borderRadius.xl};
  color: ${colors.primary};
  text-decoration: none;
  font-weight: ${typography.fontWeight.semibold};
  font-family: 'Inter', sans-serif;
  font-size: ${typography.fontSize.md};
  transition: background ${motion.duration.base};

  ${mediaQueries.down.sm} {
    width: 100%;
  }

  &:hover {
    background: rgba(0, 60, 166, 0.05); /* Assuming some alpha color */
  }
`;

const StatsCard = styled.div`
  width: 100%;
  background: ${colors.white};
  border-radius: 40px;
  padding: 60px ${spacing['5xl']};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 20px 40px rgba(6, 21, 48, 0.05);

  ${mediaQueries.down.sm} {
    flex-direction: column;
    padding: ${spacing['2xl']} ${spacing.lg};
    align-items: flex-start;
    gap: ${spacing.xl};
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.sm};
  flex: 1;

  /* Separator lines between items except the last one */
  &:not(:last-child) {
    border-right: 1px solid ${colors.borderLight};
    margin-right: ${spacing['2xl']};

    ${mediaQueries.down.sm} {
      border-right: none;
      border-bottom: 1px solid ${colors.borderLight};
      margin-right: 0;
      padding-bottom: ${spacing.xl};
      width: 100%;
    }
  }
`;

const StatNumber = styled.div`
  font-weight: ${typography.fontWeight.extrabold};
  font-size: ${typography.fontSize['9xl']};
  line-height: 100%;
  color: ${colors.primary};
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.xl};
  line-height: 140%;
  color: ${colors.textBody};
  max-width: 140px;
`;
