'use client';

import styled from 'styled-components';

import { colors, mediaQueries, spacing, typography } from '@/styles/tokens';
import { ForBrandsViewModel } from '../ForBrandsView';

export function CaseStudiesSection({ content }: { content: ForBrandsViewModel['caseStudies'] }) {
  return (
    <SectionContainer>
      <Inner>
        <HeadingWrap>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Title>{content.title}</Title>
        </HeadingWrap>

        <FeaturedRow>
          <FeaturedMedia aria-label="Case study image placeholder">Case Study Image</FeaturedMedia>

          <FeaturedContent>
            <Brand>{content.featuredBrand}</Brand>
            <Project>{content.featuredProject}</Project>

            <Stats>
              {content.featuredStats.map((stat) => (
                <Stat key={stat.label}>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </Stat>
              ))}
            </Stats>

            <Description>{content.featuredDescription}</Description>
          </FeaturedContent>
        </FeaturedRow>

        <BrandCards>
          <VerticalLabel>50+ BRANDS</VerticalLabel>
          <CardsTrack>
            {content.brandCards.map((card, idx) => (
              <BrandCard key={`${card.brand}-${idx}`} $active={Boolean(card.active)}>
                <BrandCardName>{card.brand}</BrandCardName>
                <BrandCardMetric>{card.metric}</BrandCardMetric>
              </BrandCard>
            ))}
          </CardsTrack>
        </BrandCards>

        <CategoryRow>
          {content.categories.map((item, idx) => (
            <CategoryItem key={`${item}-${idx}`}>{item}</CategoryItem>
          ))}
        </CategoryRow>
      </Inner>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  background: ${colors.secondaryDark};
  padding: 120px 0 64px;
  overflow: hidden;
`;

const Inner = styled.div`
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  gap: 64px;

  ${mediaQueries.down.lg} {
    padding: 0 ${spacing.xl};
  }

  ${mediaQueries.down.sm} {
    padding: 0 ${spacing.lg};
    gap: 40px;
  }
`;

const HeadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: ${colors.secondary};
  font-family: ${typography.fontFamily.montserrat};
  font-weight: 300;
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  letter-spacing: 0;
  text-transform: uppercase;
`;

const Title = styled.h2`
  margin: 0;
  color: ${colors.white};
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize['6xl']};
  font-weight: ${typography.fontWeight.bold};
  line-height: 140%;
  text-transform: uppercase;
`;

const FeaturedRow = styled.div`
  display: grid;
  grid-template-columns: 623px minmax(0, 1fr);
  gap: 32px;

  ${mediaQueries.down.xl} {
    grid-template-columns: 1fr;
  }
`;

const FeaturedMedia = styled.div`
  width: 100%;
  aspect-ratio: 623 / 386;
  border-radius: 40px;
  background: linear-gradient(135deg, #29b6f6 0%, #0d47a1 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const FeaturedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 24px;

  ${mediaQueries.down.xl} {
    padding-left: 0;
  }
`;

const Brand = styled.h3`
  margin: 0;
  color: ${colors.white};
  font-family: ${typography.fontFamily.montserrat};
  font-size: 68px;
  line-height: 140%;
  font-weight: ${typography.fontWeight.bold};

  ${mediaQueries.down.sm} {
    font-size: 42px;
  }
`;

const Project = styled.p`
  margin: 0;
  color: ${colors.white};
  font-family: ${typography.fontFamily.montserrat};
  font-size: 26px;
  line-height: 140%;
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px 0 12px;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  min-width: 140px;
`;

const StatValue = styled.p`
  margin: 0;
  color: ${colors.secondary};
  font-family: ${typography.fontFamily.montserrat};
  font-size: 52px;
  line-height: 110%;
  font-weight: ${typography.fontWeight.bold};
`;

const StatLabel = styled.p`
  margin: 0;
  color: ${colors.white};
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize['3xl']};
  line-height: 140%;
`;

const Description = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize['2xl']};
  line-height: 150%;
`;

const BrandCards = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 28px;
`;

const VerticalLabel = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize['4xl']};
  line-height: 100%;
  text-transform: uppercase;
`;

const CardsTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px;

  ${mediaQueries.down.xl} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${mediaQueries.down.sm} {
    grid-template-columns: 1fr;
  }
`;

const BrandCard = styled.div<{ $active: boolean }>`
  border-radius: 32px;
  padding: 32px 24px;
  min-height: 225px;
  background: ${({ $active }) => ($active ? '#1143A8' : 'rgba(10, 28, 72, 0.65)')};
  border: 1px solid ${({ $active }) => ($active ? colors.secondary : 'rgba(255,255,255,0.2)')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
`;

const BrandCardName = styled.p`
  margin: 0;
  color: ${colors.white};
  font-family: ${typography.fontFamily.montserrat};
  font-size: 48px;
  line-height: 110%;
  font-weight: ${typography.fontWeight.bold};
`;

const BrandCardMetric = styled.p`
  margin: 0;
  color: ${colors.secondary};
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize['3xl']};
  line-height: 140%;
  font-weight: ${typography.fontWeight.bold};
`;

const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
`;

const CategoryItem = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-family: ${typography.fontFamily.montserrat};
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
  font-weight: ${typography.fontWeight.bold};
`;
