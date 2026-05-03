'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';
import { HomeViewModel } from '@/lib/cms/resolvers/home.resolver';
import type { SharedContactCtaPayload } from '@/lib/cms/types';

import { Header } from '@/components/shared/Header';
import { HomeHeroPartnerSection } from './sections/HomeHeroPartnerSection';
import { CoreCompetenciesSection } from './sections/CoreCompetenciesSection';
import { EfficiencySection } from './sections/EfficiencySection';
import { ExclusiveTalentsSection } from './sections/ExclusiveTalentsSection';
import { ContactCTASection } from '@/components/shared/ContactCTASection';
import { TrendingSection } from './sections/TrendingSection';
import { Footer } from '@/components/shared/Footer';

export function HomeView({
  data,
  contactCta,
}: {
  data: HomeViewModel | null;
  contactCta?: SharedContactCtaPayload | null;
}) {
  if (!data) return null;

  return (
    <Wrapper>
      {data.globals.header && <Header content={data.globals.header} />}

      <HomeHeroPartnerSection hero={data.hero} partners={data.partners} />
      
      {data.coreCompetencies && <CoreCompetenciesSection content={data.coreCompetencies} />}
      
      <BlueGroupWrapper>
        <BlueGroupAmbient data-ambient="true" aria-hidden="true" />
        {data.efficiency && <EfficiencySection content={data.efficiency} />}
        {data.shared.exclusiveTalents && <ExclusiveTalentsSection content={data.shared.exclusiveTalents} />}
        <ContactCTASection content={contactCta} />
      </BlueGroupWrapper>
      
      {data.trending && <TrendingSection content={data.trending} />}

      {data.globals.footer && <Footer content={data.globals.footer} />}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background: ${colors.primaryLight};
  box-shadow: 0px 4.5px 225px rgba(6, 21, 48, 0.6);
  overflow-x: hidden;
  font-family: 'Montserrat', 'Inter', sans-serif;
`;

const BlueGroupWrapper = styled.div`
  position: relative;
  isolation: isolate;
  width: 100%;
  background: ${colors.primaryLight};
  display: flex;
  flex-direction: column;
  overflow: visible;

  > *:not([data-ambient='true']) {
    position: relative;
    z-index: 1;
  }
`;

const BlueGroupAmbient = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    width: min(1440px, 100%);
    border-radius: 120px;
    transform: translateX(-50%);
  }

  &::before {
    top: 28%;
    height: 1281px;
    background: #061530;
    filter: blur(100px);
  }

  &::after {
    top: 31%;
    height: 1072px;
    background: #003ca6;
    filter: blur(60px);
  }

  @media (max-width: 900px) {
    &::before {
      height: 86vw;
      border-radius: 60px;
      filter: blur(56px);
    }

    &::after {
      height: 72vw;
      border-radius: 60px;
      filter: blur(36px);
    }
  }
`;
