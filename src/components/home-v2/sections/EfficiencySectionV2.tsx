'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

const STATS = [
  {
    title: 'Lượt tiếp cận',
    description: 'Đa nền tảng, tiếp cận đa dạng tệp khách hàng',
    number: '30M+',
  },
  {
    title: 'Video được sản xuất',
    description: 'Năng lực sản xuất, đảm bảo tiến độ',
    number: '30M+',
  },
  {
    title: 'Lượt tiếp cận',
    description: 'Lượt tiếp cận',
    number: '30M+',
  },
  {
    title: 'Lượt tiếp cận',
    description: 'Lượt tiếp cận',
    number: '30M+',
  },
];

export function EfficiencySectionV2() {
  return (
    <SectionContainer>
      {/* Background ambient blurs */}
      <BgBlur style={{ width: '1547px', height: '709px', left: '-54px', top: '120px', background: colors.primary, opacity: 0.4, filter: 'blur(60px)' }} />
      <BgBlur style={{ width: '741px', height: '745px', left: '39px', top: '233px', background: colors.primary, opacity: 0.4, filter: 'blur(60px)' }} />
      <BgBlur style={{ width: '637px', height: '641px', left: '91px', top: '285px', background: colors.primary, opacity: 0.4, filter: 'blur(60px)' }} />

      <ContentWrapper>
        {/* Top header row */}
        <TopHeader>
          <TextContent>
            <Title>Hiệu quả<br />thực thi</Title>
            <Description>
              Chúng tôi cung cấp giải pháp Influencer Marketing &amp; Talent Management chuyên nghiệp, giúp thương hiệu triển khai hiệu quả và xây dựng giá trị dài hạn.
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

        {/* Stats row */}
        <StatsRow>
          {STATS.map((stat, index) => (
            <>
              <StatItem key={index}>
                <StatLabelGroup>
                  <StatTitle>{stat.title}</StatTitle>
                  <StatDescription>{stat.description}</StatDescription>
                </StatLabelGroup>
                <StatNumber>{stat.number}</StatNumber>
              </StatItem>
              {index < STATS.length - 1 && <StatDivider key={`divider-${index}`} />}
            </>
          ))}
        </StatsRow>
      </ContentWrapper>
    </SectionContainer>
  );
}

/* ─── Styled Components ─────────────────────────────────────────── */

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  background: ${colors.secondaryDark};
  border-radius: 120px;
  overflow: hidden;
  font-family: 'Montserrat', 'Inter', sans-serif;

  ${mediaQueries.down.md} {
    border-radius: 48px;
  }
`;

const BgBlur = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 120px 84px 80px;
  gap: 64px;

  ${mediaQueries.down.md} {
    padding: 60px ${spacing.xl};
    gap: ${spacing['4xl']};
  }

  ${mediaQueries.down.sm} {
    padding: 48px ${spacing.lg};
    gap: ${spacing['3xl']};
  }
`;

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;

  ${mediaQueries.down.md} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.xl};
  }
`;

const TextContent = styled.div`
  max-width: 713px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 140%;
  text-transform: uppercase;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 48px;
  }

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['5xl']};
  }
`;

const Description = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 150%;
  color: ${colors.white};
  margin: 0;
  max-width: 713px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 21px;
  flex-shrink: 0;

  ${mediaQueries.down.md} {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  background: ${colors.white};
  border-radius: 48px;
  color: ${colors.secondaryDark};
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

  ${mediaQueries.down.md} {
    width: 100%;
    justify-content: center;
  }
`;

const SecondaryButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  gap: 12px;
  background: transparent;
  border: 1px solid ${colors.white};
  border-radius: 48px;
  color: ${colors.white};
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  white-space: nowrap;
  transition: background ${motion.duration.base};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  ${mediaQueries.down.md} {
    width: 100%;
  }
`;

const StatsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 40px;

  ${mediaQueries.down.md} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 80px;
  flex: 1;
  height: 320px;

  ${mediaQueries.down.md} {
    flex-direction: row;
    align-items: center;
    height: auto;
    gap: ${spacing.xl};
    padding: ${spacing.xl} 0;
    width: 100%;
  }
`;

const StatLabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const StatTitle = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.white};
`;

const StatDescription = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.white};
`;

const StatNumber = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 140%;
  text-transform: uppercase;
  color: ${colors.secondary};

  ${mediaQueries.down.md} {
    font-size: ${typography.fontSize['6xl']};
  }
`;

const StatDivider = styled.div`
  width: 1px;
  height: 320px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;

  ${mediaQueries.down.md} {
    display: none;
  }
`;
