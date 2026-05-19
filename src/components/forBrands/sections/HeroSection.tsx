'use client';

import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

import { colors, mediaQueries, motion, spacing, typography } from '@/styles/tokens';
import { ForBrandsHeroBackground } from './ForBrandsHeroBackground';
import { ForBrandsViewModel } from '../ForBrandsView';

export function HeroSection({ content }: { content: ForBrandsViewModel['hero'] }) {
  const hasSecondaryCta = Boolean(content.secondaryCtaLabel && content.secondaryCtaUrl);
  const titleLines = content.title.split('\n').filter(Boolean);
  return (
    <HeroSectionRoot>
      <ForBrandsHeroBackground />
      <ContentBox>
        <HeroTitle>
          {titleLines.map((line, idx) => (
            <HeroTitleLine key={`${line}-${idx}`}>{line}</HeroTitleLine>
          ))}
        </HeroTitle>
        <HeroSubtitle>{content.subtitle}</HeroSubtitle>
        <ButtonRow>
          <PrimaryButton href={content.primaryCtaUrl}>
            {content.primaryCtaLabel}
            <ArrowIcon>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="#061530" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ArrowIcon>
          </PrimaryButton>
          {hasSecondaryCta ? (
            <SecondaryButton href={content.secondaryCtaUrl!}>{content.secondaryCtaLabel}</SecondaryButton>
          ) : null}
        </ButtonRow>
      </ContentBox>
    </HeroSectionRoot>
  );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const HeroSectionRoot = styled.section`
  position: relative;
  width: 100%;
  background: #b4cfff;
  aspect-ratio: 1440 / 670;
  min-height: 670px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQueries.down.lg} {
    aspect-ratio: auto;
    min-height: 520px;
  }

  ${mediaQueries.down.sm} {
    min-height: 420px;
  }
`;

const ContentBox = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.xl};
  width: 100%;
  max-width: 843px;
  margin: 0 auto;
  padding: 0 ${spacing.xl};
  animation: ${fadeUp} 0.7s ease both;

  ${mediaQueries.down.sm} {
    gap: ${spacing.lg};
    padding: 0 ${spacing.lg};
  }
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 120%;
  text-align: center;
  text-transform: uppercase;
  color: #061530;

  ${mediaQueries.down.lg} {
    font-size: 48px;
  }

  ${mediaQueries.down.sm} {
    font-size: 32px;
  }
`;

const HeroTitleLine = styled.span`
  display: block;
  white-space: nowrap;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  max-width: 620px;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.md};
  line-height: 150%;
  text-align: center;
  color: #061530;

  ${mediaQueries.down.sm} {
    font-size: 14px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 21.33px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  height: 54px;
  padding: 16px 32px;
  background: ${colors.secondary};
  border-radius: 48px;
  text-decoration: none;
  transition: transform ${motion.duration.base} ease, background ${motion.duration.base} ease;

  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.secondaryDark};

  &:hover {
    background: #f5d930;
    transform: translateY(-2px);
  }
`;

const ArrowIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const SecondaryButton = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  height: 54px;
  background: transparent;
  border: 1px solid ${colors.white};
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 48px;
  text-decoration: none;
  cursor: pointer;
  transition: background ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.white};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;
