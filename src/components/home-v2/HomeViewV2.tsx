'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';

import { HeaderV2 } from './shared/HeaderV2';
import { HeroSectionV2 } from './sections/HeroSectionV2';
import { PartnersSectionV2 } from './sections/PartnersSectionV2';
import { CoreCompetenciesSectionV2 } from './sections/CoreCompetenciesSectionV2';
import { EfficiencySectionV2 } from './sections/EfficiencySectionV2';
import { ExclusiveTalentsSectionV2 } from './sections/ExclusiveTalentsSectionV2';
import { ContactCTASectionV2 } from './sections/ContactCTASectionV2';
import { TrendingSectionV2 } from './sections/TrendingSectionV2';
import { FooterV2 } from './shared/FooterV2';

export function HomeViewV2() {
  return (
    <Wrapper>
      <HeaderV2 />
      <HeroSectionV2 />
      <PartnersSectionV2 />
      <CoreCompetenciesSectionV2 />
      <EfficiencySectionV2 />
      <ExclusiveTalentsSectionV2 />
      <ContactCTASectionV2 />
      <TrendingSectionV2 />

      <FooterV2 />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background: ${colors.brandLightBlue};
  box-shadow: 0px 4.5px 225px rgba(6, 21, 48, 0.6);
  overflow-x: hidden;
  font-family: 'Montserrat', 'Inter', sans-serif;
`;
