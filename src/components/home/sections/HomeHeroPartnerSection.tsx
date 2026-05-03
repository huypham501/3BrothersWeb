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
        <HeroSection content={hero} isComposite />
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
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: linear-gradient(180deg, #000000 84.09%, #071e48 100%);
  overflow: hidden;
`;

const PartnerLayer = styled.div`
  width: 100%;
  min-height: 210px;
  display: flex;
  align-items: center;

  ${mediaQueries.down.lg} {
    min-height: 160px;
  }

  ${mediaQueries.down.sm} {
    min-height: 140px;
  }
`;

const HeroOnlyWrapper = styled.div`
  width: 100%;
  position: relative;
  background: linear-gradient(180deg, #000000 84.09%, #071e48 100%);
`;
