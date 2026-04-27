'use client';

import styled from 'styled-components';
import { mediaQueries } from '@/styles/tokens';
import { HomeHeroPayload, HomePartnersPayload } from '@/lib/cms/types';
import { HeroSection } from './HeroSection';
import { PartnersSection } from './PartnersSection';

export function HomeHeroPartnerSection({
  hero,
  partners,
}: {
  hero: HomeHeroPayload | null;
  partners: HomePartnersPayload | null;
}) {
  if (!hero && !partners) return null;

  if (hero && partners) {
    return (
      <CompositeStage>
        <HeroLayer>
          <HeroSection content={hero} isComposite />
        </HeroLayer>
        <PartnerLayer>
          <PartnersSection content={partners} inComposite />
        </PartnerLayer>
      </CompositeStage>
    );
  }

  if (hero) {
    return (
      <HeroOnlyWrapper>
        <HeroSection content={hero} />
      </HeroOnlyWrapper>
    );
  }

  return <PartnersSection content={partners!} />;
}

const CompositeStage = styled.section`
  --hero-height: 800px;
  --stage-height: 1010px;
  --partner-band-height: calc(var(--stage-height) - var(--hero-height));
  position: relative;
  width: 100%;
  min-height: var(--stage-height);
  background: linear-gradient(180deg, #000000 84.09%, #071e48 100%);
  overflow: hidden;

  ${mediaQueries.down.lg} {
    --stage-height: 960px;
  }

  ${mediaQueries.down.sm} {
    --hero-height: 680px;
    --stage-height: 820px;
  }
`;

const HeroLayer = styled.div`
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 2;
`;

const PartnerLayer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--partner-band-height);
  display: flex;
  align-items: center;
  z-index: 1;
`;

const HeroOnlyWrapper = styled.div`
  width: 100%;
  position: relative;
  background: linear-gradient(180deg, #000000 84.09%, #071e48 100%);
`;
