'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';
import { HomeViewModel } from '@/lib/cms/resolvers/home.resolver';

import { HeaderV2 } from './shared/HeaderV2';
import { HomeHeroPartnerSectionV2 } from './sections/HomeHeroPartnerSectionV2';
import { CoreCompetenciesSectionV2 } from './sections/CoreCompetenciesSectionV2';
import { EfficiencySectionV2 } from './sections/EfficiencySectionV2';
import { ExclusiveTalentsSectionV2 } from './sections/ExclusiveTalentsSectionV2';
import { ContactCTASectionV2 } from './sections/ContactCTASectionV2';
import { TrendingSectionV2 } from './sections/TrendingSectionV2';
import { FooterV2 } from './shared/FooterV2';

export function HomeViewV2({ data }: { data: HomeViewModel | null }) {
  if (!data) return null;

  return (
    <Wrapper>
      {data.globals.header && <HeaderV2 content={data.globals.header} />}

      <HomeHeroPartnerSectionV2 hero={data.hero} partners={data.partners} />
      
      {data.coreCompetencies && <CoreCompetenciesSectionV2 content={data.coreCompetencies} />}
      
      <BlueGroupWrapper>
        {data.efficiency && <EfficiencySectionV2 content={data.efficiency} />}
        {data.shared.exclusiveTalents && <ExclusiveTalentsSectionV2 content={data.shared.exclusiveTalents} />}
        {data.shared.contactCta && <ContactCTASectionV2 content={data.shared.contactCta} />}
      </BlueGroupWrapper>
      
      {data.trending && <TrendingSectionV2 content={data.trending} />}

      {data.globals.footer && <FooterV2 content={data.globals.footer} />}
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
