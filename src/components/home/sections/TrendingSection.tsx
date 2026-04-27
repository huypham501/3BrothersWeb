'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

import { HomeTrendingPayload } from '@/lib/cms/types';

export function TrendingSection({ content }: { content: HomeTrendingPayload }) {
  const newsItems = (content.news_items || []).slice(0, content.news_limit || 3);

  return (
    <SectionContainer>
      <HeaderRow>
        <Title>{content.section_title}</Title>
        <DividerLine />
      </HeaderRow>

      <CardsGrid>
        {newsItems.map((news, index) => (
          <a key={index} href={news.url || '#'} style={{ display: 'contents', textDecoration: 'none' }}>
            <NewsCard>
              {news.image ? (
                <CardImageWrapper>
                  <Image
                    src={news.image}
                    alt={news.image_alt || news.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </CardImageWrapper>
              ) : (
                <CardImage />
              )}
              <CardContent>
                <CardTitle>{news.title}</CardTitle>
                <CardDate>{news.date}</CardDate>
              </CardContent>
            </NewsCard>
          </a>
        ))}
      </CardsGrid>

      {content.view_all_label && content.view_all_url && (
        <ViewAllLink href={content.view_all_url}>
          {content.view_all_label}
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.67} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </ViewAllLink>
      )}
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  padding: 120px 84px;
  background: ${colors.bgDark};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  color: ${colors.white};
  isolation: isolate;

  ${mediaQueries.down.sm} {
    padding: 60px ${spacing.lg};
  }
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 41px;
  margin-bottom: 64px;

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.lg};
    margin-bottom: 40px;
  }
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.bold};
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
  margin: 0;
  color: ${colors.white};
  white-space: nowrap;
  flex-shrink: 0;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['5xl']};
  }
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${colors.primaryLight};
  opacity: 0.5;
`;

const CardsGrid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 33px;
  width: 100%;
  padding-bottom: 24px;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    padding-bottom: 0;
    gap: ${spacing['2xl']};
  }
`;

const NewsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
  cursor: pointer;
  transition: transform ${motion.duration.base};

  &:hover {
    transform: translateY(-8px);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 268px;
  border-radius: 24px;
  border: 1px solid ${colors.white};
  background: linear-gradient(180deg, #A48B8B, #4C3C3C);
  flex-shrink: 0;
  overflow: hidden;
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 268px;
  border-radius: 24px;
  border: 1px solid ${colors.white};
  overflow: hidden;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const CardTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['2xl']};
  line-height: 140%;
  color: ${colors.white};
  margin: 0;
`;

const CardDate = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.normal};
  font-size: 12px;
  line-height: 140%;
  color: ${colors.white};
  text-transform: uppercase;
  opacity: 0.8;
`;

const ViewAllLink = styled.a`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.secondary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  margin-top: ${spacing['3xl']};

  svg {
    stroke: ${colors.secondary};
  }

  &:hover {
    text-decoration: underline;
    opacity: 0.85;
  }
`;
