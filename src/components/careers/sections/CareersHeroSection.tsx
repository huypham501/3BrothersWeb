'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';

// ── Perks / Value props data ──────────────────────────────────────────────────

const PERKS = [
  {
    id: 'grow',
    icon: <GrowIcon />,
    title: 'Phát triển nhanh',
    description: 'Cơ hội phát triển sự nghiệp vượt bậc trong ngành Influencer Marketing đang bùng nổ.',
  },
  {
    id: 'team',
    icon: <TeamIcon />,
    title: 'Đội ngũ trẻ trung',
    description: 'Làm việc cùng những người trẻ tài năng, sáng tạo và đầy nhiệt huyết trong lĩnh vực media.',
  },
  {
    id: 'creative',
    icon: <CreativeIcon />,
    title: 'Sáng tạo không giới hạn',
    description: 'Tự do thể hiện ý tưởng, được khuyến khích đổi mới và phá vỡ khuôn mẫu truyền thống.',
  },
];

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function GrowIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 35L15 22l7 7 8-10 5 6" stroke="#003CA6" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 15l7-7M35 8v6M35 8h-6" stroke="#003CA6" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="13" r="5" stroke="#003CA6" strokeWidth="3.33"/>
      <path d="M4 33c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#003CA6" strokeWidth="3.33" strokeLinecap="round"/>
      <circle cx="28" cy="13" r="4" stroke="#003CA6" strokeWidth="3.33"/>
      <path d="M34 33c0-4.418-2.686-8-6-8" stroke="#003CA6" strokeWidth="3.33" strokeLinecap="round"/>
    </svg>
  );
}

function CreativeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5l2.5 7.5H30l-6.25 4.5 2.5 7.5L20 20l-6.25 4.5 2.5-7.5L10 12.5h7.5L20 5z" stroke="#003CA6" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 30h24M12 35h16" stroke="#003CA6" strokeWidth="3.33" strokeLinecap="round"/>
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CareersHeroSection() {
  return (
    <SectionContainer>
      <Inner>
        {/* Heading block */}
        <TextBlock>
          <HeadingGroup>
            <Superlabel>Gia nhập đội ngũ</Superlabel>
            <MainTitle>3Brothers Media</MainTitle>
          </HeadingGroup>
          <Subtitle>
            Chúng tôi đang tìm kiếm những tài năng đam mê sáng tạo, yêu thích thế giới Influencer Marketing và muốn tạo ra những giá trị khác biệt.
          </Subtitle>
        </TextBlock>

        {/* 3-column perk cards */}
        <PerksRow>
          {PERKS.map((perk) => (
            <PerkCard key={perk.id}>
              <IconWrapper>{perk.icon}</IconWrapper>
              <PerkTitle>{perk.title}</PerkTitle>
              <PerkDesc>{perk.description}</PerkDesc>
            </PerkCard>
          ))}
        </PerksRow>
      </Inner>
    </SectionContainer>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  width: 100%;
  background: ${colors.white};
  padding: 80px 0 100px;

  ${mediaQueries.down.lg} {
    padding: 60px 0 80px;
  }

  ${mediaQueries.down.sm} {
    padding: 48px 0 60px;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 72px;

  ${mediaQueries.down.lg} {
    padding: 0 ${spacing.xl};
    gap: 48px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 ${spacing.lg};
    gap: 40px;
  }
`;

/* Heading block — centered, max 843px */
const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 843px;
  width: 100%;
  text-align: center;
`;

const HeadingGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

/* "GIA NHẬP ĐỘI NGŨ" — 26px uppercase navy */
const Superlabel = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  text-align: center;
  text-transform: uppercase;
  color: ${colors.secondaryDark}; /* #061530 */
  margin: 0;
  width: 100%;

  ${mediaQueries.down.sm} {
    font-size: 18px;
  }
`;

/* "3Brothers Media" — 68px cobalt blue */
const MainTitle = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 140%;
  text-align: center;
  color: ${colors.primary}; /* #003CA6 */
  margin: 0;
  width: 100%;

  ${mediaQueries.down.lg} {
    font-size: 48px;
  }

  ${mediaQueries.down.sm} {
    font-size: 32px;
  }
`;

/* Subtitle — 16px regular dark */
const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 150%;
  text-align: center;
  color: ${colors.secondaryDark};
  margin: 0;

  ${mediaQueries.down.sm} {
    font-size: 14px;
  }
`;

/* 3-column cards row */
const PerksRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 32px;
  width: 100%;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    gap: ${spacing.xl};
  }
`;

/* Individual perk card — white/Zircon bg, cobalt border, 24px radius, 32px padding */
const PerkCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 32px;
  gap: 19px;
  flex: 1;
  min-width: 0;
  background: #F0F4FF;
  border: 1px solid rgba(0, 60, 166, 0.1);
  border-radius: 24px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 8px 24px rgba(0, 60, 166, 0.12);
  }

  ${mediaQueries.down.lg} {
    width: 100%;
  }
`;

/* Icon box — 40×40 */
const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

/* Card title — 26px bold #061530 */
const PerkTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.secondaryDark};
  margin: 0;
`;

/* Card description — 16px regular, 70% opacity navy */
const PerkDesc = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: rgba(6, 21, 48, 0.7);
  margin: 0;
`;
