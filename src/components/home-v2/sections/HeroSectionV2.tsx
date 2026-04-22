'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';
import { HeroBackgroundGraphics } from '../components/HeroBackgroundGraphics';
import { HeroMediaPlaceholder } from '../components/HeroMediaPlaceholder';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

import { HomeHeroPayload } from '@/lib/cms/types';

export function HeroSectionV2({
  content,
  className,
  isComposite = false,
}: {
  content: HomeHeroPayload;
  className?: string;
  isComposite?: boolean;
}) {
  return (
    <HeroContainer className={className} $isComposite={isComposite}>
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
            {content.secondary_cta_label && content.secondary_cta_url && (
              <SecondaryButton href={content.secondary_cta_url}>{content.secondary_cta_label}</SecondaryButton>
            )}
          </ButtonGroup>
        </TextBlock>
        {content.media_image ? (
          <Image
            src={content.media_image}
            alt={content.media_image_alt || 'Hero media'}
            width={1200}
            height={800}
            style={{ maxWidth: '600px', width: '100%', height: 'auto', borderRadius: '24px' }}
          />
        ) : (
          <HeroMediaPlaceholder />
        )}
      </ContentWrapper>
    </HeroContainer>
  );
}

const HeroContainer = styled.section<{ $isComposite: boolean }>`
  position: relative;
  width: 100%;
  min-height: 800px;
  background: #061530;
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
