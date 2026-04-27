'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';
import { HomeViewModel } from '@/lib/cms/resolvers/home.resolver';

import { Header } from '@/components/shared/Header';
import { HomeHeroPartnerSection } from './sections/HomeHeroPartnerSection';
import { CoreCompetenciesSection } from './sections/CoreCompetenciesSection';
import { EfficiencySection } from './sections/EfficiencySection';
import { ExclusiveTalentsSection } from './sections/ExclusiveTalentsSection';
import { ContactCTASection } from '@/components/shared/ContactCTASection';
import { TrendingSection } from './sections/TrendingSection';
import { Footer } from '@/components/shared/Footer';

export function HomeView({ data }: { data: HomeViewModel | null }) {
  if (!data) return null;

  return (
    <Wrapper>
      {data.globals.header && <Header content={data.globals.header} />}

      <HomeHeroPartnerSection hero={data.hero} partners={data.partners} />
      
      {data.coreCompetencies && <CoreCompetenciesSection content={data.coreCompetencies} />}
      
      <BlueGroupWrapper>
        {data.efficiency && <EfficiencySection content={data.efficiency} />}
        {data.shared.exclusiveTalents && <ExclusiveTalentsSection content={data.shared.exclusiveTalents} />}
        {data.shared.contactCta && <ContactCTASection content={data.shared.contactCta} />}
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
  width: 100%;
  background: ${colors.primaryLight};
  display: flex;
  flex-direction: column;
`;
