'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';
import { HeroBackgroundGraphics } from '../components/HeroBackgroundGraphics';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { normalizeAspectRatio } from '@/lib/aspect-ratio';

import { HomeHeroPayload } from '@/lib/cms/types';

export function HeroSection({
  content,
  className,
  isComposite = false,
}: {
  content: HomeHeroPayload;
  className?: string;
  isComposite?: boolean;
}) {
  const heroAspectRatio = normalizeAspectRatio(content.hero_aspect_ratio, '1440 / 800');
  const hasSecondaryCta = Boolean(content.secondary_cta_label && content.secondary_cta_url);
  const hasMediaImage = Boolean(content.media_image);

  return (
    <HeroContainer className={className} $isComposite={isComposite} $aspectRatio={heroAspectRatio}>
      <HeroBackgroundGraphics />
      <ContentWrapper>
        <TextBlock>
          <Title dangerouslySetInnerHTML={{ __html: content.title.replace(/\n/g, '<br />') }} />
          <SubText>{content.subtext}</SubText>
          <ButtonGroup>
            <PrimaryButton href={content.primary_cta_url}>
              {content.primary_cta_label}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </PrimaryButton>
            {hasSecondaryCta && (
              <SecondaryButton href={content.secondary_cta_url}>{content.secondary_cta_label}</SecondaryButton>
            )}
          </ButtonGroup>
        </TextBlock>
        {hasMediaImage && (
          <HeroMediaStack>
            <HeroMediaImageLayer>
              <Image
                src={content.media_image}
                alt={content.media_image_alt || 'Hero media'}
                fill
                sizes="(max-width: 1024px) 100vw, 563px"
                style={{ objectFit: 'cover' }}
              />
              <HeroMediaOverlay />
            </HeroMediaImageLayer>
          </HeroMediaStack>
        )}
      </ContentWrapper>
    </HeroContainer>
  );
}

const HeroContainer = styled.section<{ $isComposite: boolean; $aspectRatio: string }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
  min-height: 800px;
  background: #061530;
  border-radius: 0 0 120px 120px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 ${spacing['5xl']};
  color: ${colors.white};

  ${mediaQueries.down.lg} {
    aspect-ratio: auto;
    min-height: 1340px;
    padding: 0 ${spacing['3xl']};
  }

  ${mediaQueries.down.sm} {
    min-height: ${({ $isComposite }) => ($isComposite ? '680px' : '100vh')};
    padding: ${spacing['2xl']} ${spacing.lg};
    border-radius: 0 0 80px 80px;
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

const HeroMediaStack = styled.div`
  width: 100%;
  max-width: 563px;
  aspect-ratio: 563 / 676;
  position: relative;
  margin-top: -300px;
  z-index: 0;

  ${mediaQueries.down.lg} {
    margin-top: ${spacing.xl};
    max-width: 480px;
  }
`;

const HeroMediaImageLayer = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 0 0 140px 140px;
  overflow: hidden;
  z-index: 2;
  transform: scale(1.035);
  transform-origin: center;
  box-shadow:
    0 0 0 4px rgba(145, 191, 255, 0.9),
    0 0 16px rgba(67, 124, 255, 0.7);

  ${mediaQueries.down.lg} {
    border-radius: 0 0 140px 140px;
    transform: scale(1.028);
    box-shadow:
      0 0 0 3px rgba(145, 191, 255, 0.88),
      0 0 16px rgba(67, 124, 255, 0.62);
  }
`;

const HeroMediaOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30%;
  background: linear-gradient(180deg, rgba(6, 21, 48, 0) 0%, rgba(6, 21, 48, 0.7) 100%);
  pointer-events: none;
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
