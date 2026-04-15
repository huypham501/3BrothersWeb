'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';
import { HomeViewModel } from '@/lib/cms/resolvers/home.resolver';

import { HeaderV2 } from './shared/HeaderV2';
import { HeroSectionV2 } from './sections/HeroSectionV2';
import { PartnersSectionV2 } from './sections/PartnersSectionV2';
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
      
      <HeroPartnersWrapper>
        {data.hero && <HeroSectionV2 content={data.hero} />}
        {data.partners && <PartnersSectionV2 content={data.partners} />}
      </HeroPartnersWrapper>
      
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

const HeroPartnersWrapper = styled.div`
  width: 100%;
  position: relative;
  background: linear-gradient(180deg, #000000 84.09%, #071E48 100%);
`;

const BlueGroupWrapper = styled.div`
  width: 100%;
  background: ${colors.primaryLight};
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-bottom: 40px;
`;
