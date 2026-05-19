'use client';

import styled, { css, keyframes } from 'styled-components';

import { colors, mediaQueries, spacing, typography } from '@/styles/tokens';
import { ForBrandsViewModel } from '../ForBrandsView';
import { useInlineDescriptionClamp } from '../../home/sections/ExclusiveTalentsSection/hooks/useInlineDescriptionClamp';
import { useHorizontalSlider } from '../../home/sections/ExclusiveTalentsSection/hooks/useHorizontalSlider';
import { ForBrandsCaseStudiesBackground } from './ForBrandsCaseStudiesBackground';

export function CaseStudiesSection({ content }: { content: ForBrandsViewModel['caseStudies'] }) {
  const {
    rowRef,
    fillRef,
    trackRef,
    isTrackDragging,
    isRowDragging,
    rowEvents,
    trackEvents,
  } = useHorizontalSlider();

  const descriptionText = content.featuredDescription || '';
  const {
    containerRef,
    measureRef,
    measureTextRef,
    measureSuffixRef,
    isExpandable,
    isExpanded,
    setIsExpanded,
    visibleText,
  } = useInlineDescriptionClamp(descriptionText);
  const shouldAnimateCategories = content.categories.length >= 4;

  return (
    <SectionContainer>
      <ForBrandsCaseStudiesBackground />
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

            <DescriptionBlock>
              <DescriptionInner ref={containerRef}>
                <DescriptionText>
                  {!isExpandable || isExpanded ? (
                    descriptionText
                  ) : (
                    <>
                      {visibleText}
                      <ReadMoreSuffix>... </ReadMoreSuffix>
                      <ReadMoreButton onClick={() => setIsExpanded(true)}>xem thêm</ReadMoreButton>
                    </>
                  )}
                </DescriptionText>

                <MeasureDescription ref={measureRef} aria-hidden="true">
                  <span ref={measureTextRef} />
                  <MeasureSuffix ref={measureSuffixRef}>... xem thêm</MeasureSuffix>
                </MeasureDescription>
              </DescriptionInner>
            </DescriptionBlock>
          </FeaturedContent>
        </FeaturedRow>

        <BrandCards>
          <VerticalLabel>50+ BRANDS</VerticalLabel>
          <CardsSliderTrack>
            <CardsTrack ref={rowRef} $isDragging={isRowDragging} {...rowEvents}>
              {content.brandCards.map((card, idx) => (
                <BrandCard key={`${card.brand}-${idx}`} $active={Boolean(card.active)}>
                  <BrandCardImageFrame aria-label={`${card.brand} image placeholder`}>
                    <BrandCardImage />
                  </BrandCardImageFrame>
                  <BrandCardMetric>{card.metric}</BrandCardMetric>
                </BrandCard>
              ))}
            </CardsTrack>

            <CardsScrollbarTrack ref={trackRef} $isDragging={isTrackDragging} {...trackEvents}>
              <CardsScrollbarFill ref={fillRef} />
            </CardsScrollbarTrack>
          </CardsSliderTrack>
        </BrandCards>

      </Inner>
      <CategoryMarquee>
        <CategoryViewport>
          <CategoryTrack data-marquee-track="true" $animate={shouldAnimateCategories}>
              <CategorySet $animate={shouldAnimateCategories}>
                {content.categories.map((item, idx) => (
                  <CategoryToken key={`category-original-${item}-${idx}`}>
                    <CategoryIcon aria-hidden="true" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M26.6663 35V31.6667C26.6663 29.8986 25.964 28.2029 24.7137 26.9526C23.4635 25.7024 21.7678 25 19.9997 25H9.99967C8.23156 25 6.53587 25.7024 5.28563 26.9526C4.03539 28.2029 3.33301 29.8986 3.33301 31.6667V35" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M26.667 5.21289C28.0966 5.58351 29.3626 6.41833 30.2665 7.58633C31.1703 8.75433 31.6607 10.1894 31.6607 11.6662C31.6607 13.1431 31.1703 14.5781 30.2665 15.7461C29.3626 16.9141 28.0966 17.7489 26.667 18.1196" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M36.667 35.0001V31.6668C36.6659 30.1897 36.1743 28.7548 35.2693 27.5873C34.3643 26.4199 33.0972 25.5861 31.667 25.2168" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14.9997 18.3333C18.6816 18.3333 21.6663 15.3486 21.6663 11.6667C21.6663 7.98477 18.6816 5 14.9997 5C11.3178 5 8.33301 7.98477 8.33301 11.6667C8.33301 15.3486 11.3178 18.3333 14.9997 18.3333Z" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    </CategoryIcon>
                    <CategoryItem>{item}</CategoryItem>
                  </CategoryToken>
                ))}
              </CategorySet>

            {shouldAnimateCategories && (
                <CategorySet aria-hidden="true" $animate={shouldAnimateCategories}>
                  {content.categories.map((item, idx) => (
                    <CategoryToken key={`category-clone-${item}-${idx}`}>
                      <CategoryIcon aria-hidden="true" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.6663 35V31.6667C26.6663 29.8986 25.964 28.2029 24.7137 26.9526C23.4635 25.7024 21.7678 25 19.9997 25H9.99967C8.23156 25 6.53587 25.7024 5.28563 26.9526C4.03539 28.2029 3.33301 29.8986 3.33301 31.6667V35" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M26.667 5.21289C28.0966 5.58351 29.3626 6.41833 30.2665 7.58633C31.1703 8.75433 31.6607 10.1894 31.6607 11.6662C31.6607 13.1431 31.1703 14.5781 30.2665 15.7461C29.3626 16.9141 28.0966 17.7489 26.667 18.1196" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M36.667 35.0001V31.6668C36.6659 30.1897 36.1743 28.7548 35.2693 27.5873C34.3643 26.4199 33.0972 25.5861 31.667 25.2168" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.9997 18.3333C18.6816 18.3333 21.6663 15.3486 21.6663 11.6667C21.6663 7.98477 18.6816 5 14.9997 5C11.3178 5 8.33301 7.98477 8.33301 11.6667C8.33301 15.3486 11.3178 18.3333 14.9997 18.3333Z" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </CategoryIcon>
                      <CategoryItem>{item}</CategoryItem>
                    </CategoryToken>
                  ))}
                </CategorySet>
              )}
          </CategoryTrack>
        </CategoryViewport>
      </CategoryMarquee>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  background: ${colors.secondaryDark};
  padding: 120px 0 64px;
  overflow: hidden;
  isolation: isolate;
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
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
  font-weight: 300;
  font-size: 26px;
  line-height: 140%;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  gap: 24px;
  padding: 24px 0 12px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
`;

const StatValue = styled.p`
  margin: 0;
  color: ${colors.secondary};
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.medium};
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
`;

const StatLabel = styled.p`
  margin: 0;
  color: ${colors.white};
  font-family: ${typography.fontFamily.montserrat};
  font-weight: 300;
  font-size: 16px;
  line-height: 140%;
`;

const DescriptionBlock = styled.div`
  display: flex;
  padding: 12px 0 0;
  align-self: stretch;
`;

const DescriptionInner = styled.div`
  display: block;
  flex: 1;
  min-width: 0;
  position: relative;
`;

const DescriptionText = styled.p`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const ReadMoreSuffix = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  display: inline-block;
  margin-left: 0;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: inherit;
  color: ${colors.white};
  cursor: pointer;
  text-align: left;
  vertical-align: baseline;
  white-space: nowrap;
`;

const MeasureDescription = styled.p`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  pointer-events: none;
  visibility: hidden;
  z-index: -1;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 150%;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const MeasureSuffix = styled.span`
  font-weight: ${typography.fontWeight.bold};
`;

const BrandCards = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  width: 100%;

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const VerticalLabel = styled.p`
  margin: 0;
  color: ${colors.white};
  opacity: 0.5;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  margin-top: -30px;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: 300;
  font-size: 26px;
  line-height: 140%;
  text-align: center;
  text-transform: uppercase;
  flex: none;

  ${mediaQueries.down.sm} {
    writing-mode: horizontal-tb;
    transform: none;
    font-size: 24px;
  }
`;

const CardsSliderTrack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const CardsTrack = styled.div<{ $isDragging: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 24px;
  width: 100%;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'grab')};
  user-select: none;
  touch-action: pan-y;
`;

const BrandCard = styled.div<{ $active: boolean }>`
  width: 236px;
  height: 178px;
  max-width: 100%;
  border-radius: 32px;
  padding: 12px 8px 24px;
  background: ${({ $active }) => ($active ? '#1143A8' : 'rgba(10, 28, 72, 0.65)')};
  border: 2px solid ${({ $active }) => ($active ? colors.secondary : 'rgba(255,255,255,0.2)')};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 0;
  flex: none;
`;

const CardsScrollbarTrack = styled.div<{ $isDragging: boolean }>`
  width: 118px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  position: relative;
  flex: none;
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'grab')};
  touch-action: none;
`;

const CardsScrollbarFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 8px;
  width: 43px;
  background: ${colors.white};
  border-radius: 10px;
`;

const BrandCardImageFrame = styled.div`
  width: 220px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
`;

const BrandCardImage = styled.div`
  width: 188px;
  height: 80px;
  background: transparent;
  flex: none;
`;

const BrandCardMetric = styled.p`
  width: 151px;
  height: 22px;
  margin: 0;
  color: #ffe773;
  font-family: ${typography.fontFamily.montserrat};
  font-size: 16px;
  line-height: 140%;
  font-weight: ${typography.fontWeight.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: none;
`;

const categoryMarquee = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

const CategoryMarquee = styled.div`
  width: 100%;
  margin-top: 64px;

  &:hover [data-marquee-track='true'],
  &:focus-within [data-marquee-track='true'] {
    animation-play-state: paused;
  }
`;

const CategoryViewport = styled.div`
  width: 100%;
  overflow: hidden;
`;

const CategoryTrack = styled.div<{ $animate: boolean }>`
  display: flex;
  align-items: center;
  gap: 24px;
  width: ${({ $animate }) => ($animate ? 'max-content' : '100%')};
  animation: ${({ $animate }) => ($animate ? css`${categoryMarquee} 26s linear infinite` : 'none')};
  will-change: transform;

  ${mediaQueries.down.md} {
    animation-duration: ${({ $animate }) => ($animate ? '22s' : '0s')};
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
  }
`;

const CategorySet = styled.div<{ $animate: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $animate }) => ($animate ? 'flex-start' : 'center')};
  gap: 24px;
  width: ${({ $animate }) => ($animate ? 'max-content' : '100%')};
  flex: none;
`;

const CategoryToken = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  flex: none;
`;

const CategoryIcon = styled.svg`
  width: 40px;
  height: 40px;
  flex: none;
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
