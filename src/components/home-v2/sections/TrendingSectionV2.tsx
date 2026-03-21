'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

const NEWS_DATA = [
  {
    title: "2025 - Một năm tăng tốc Media trong hệ sinh thái Influence",
    date: "12 JAN 2026"
  },
  {
    title: "Đồng hành cùng chương trình 'Xuân Về Bản Em 2026'",
    date: "12 JAN 2026"
  },
  {
    title: "3BROTHERS MEDIA x WECHOICE AWARDS 2025",
    date: "12 JAN 2026"
  }
];

export function TrendingSectionV2() {
  return (
    <SectionContainer>
      <HeaderRow>
        <Title>Xu hướng có gì?</Title>
        <ViewAllLink href="#">
          Xem tất cả
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </ViewAllLink>
      </HeaderRow>
      
      <CardsGrid>
        {NEWS_DATA.map((news, index) => (
          <NewsCard key={index}>
            <CardImage />
            <CardContent>
              <CardDate>{news.date}</CardDate>
              <CardTitle>{news.title}</CardTitle>
            </CardContent>
          </NewsCard>
        ))}
      </CardsGrid>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  padding: 120px ${spacing['5xl']};
  background: ${colors.bgDark};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  color: ${colors.white};

  ${mediaQueries.down.sm} {
    padding: 60px ${spacing.lg};
    gap: ${spacing['2xl']};
  }
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  max-width: 1280px;

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.lg};
  }
`;

const Title = styled.h2`
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

const ViewAllLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.lg};
  color: ${colors.white};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  opacity: 0.9;

  &:hover {
    text-decoration: underline;
    opacity: 1;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing['2xl']};
  width: 100%;
  max-width: 1280px;

  ${mediaQueries.down.lg} {
    grid-template-columns: 1fr;
  }
`;

const NewsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  cursor: pointer;
  transition: transform ${motion.duration.base};

  &:hover {
    transform: translateY(-8px);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 280px;
  border-radius: 30px;
  background: linear-gradient(180deg, #A48B8B, #4C3C3C);
  border: 2px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.6);
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.semibold};
  
  &::after {
    content: 'Article Image Placeholder';
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const CardDate = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.base};
  color: #AEC2F2;
  text-transform: uppercase;
`;

const CardTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['2xl']};
  line-height: 140%;
  color: ${colors.white};
  margin: ${spacing[0]};
`;
