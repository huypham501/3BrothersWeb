'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';

import { HeaderV2 } from '@/components/home-v2/shared/HeaderV2';
import { FooterV2 } from '@/components/home-v2/shared/FooterV2';
import { ContactCTASectionV2 } from '@/components/home-v2/sections/ContactCTASectionV2';
import { ForCreatorsHeroSectionV2 } from './sections/ForCreatorsHeroSectionV2';
import { ForCreatorsBenefitSection } from './sections/ForCreatorsBenefitSection';
import { ForCreatorsTestimonialsSection } from './sections/ForCreatorsTestimonialsSection';
import { ExclusiveTalentsSectionV2 } from '@/components/home-v2/sections/ExclusiveTalentsSectionV2';
import { ForCreatorsCTASection } from './sections/ForCreatorsCTASection';
import type { ForCreatorsViewModel } from '@/lib/cms/resolvers/for-creators.resolver';

export function ForCreatorsViewV2({ data }: { data: ForCreatorsViewModel | null }) {
  if (!data) return null;

  return (
    <Wrapper>
      {data.globals.header && <HeaderV2 content={data.globals.header} />}
      <MainContent>
        {data.hero && <ForCreatorsHeroSectionV2 content={data.hero} />}
        {data.benefit && <ForCreatorsBenefitSection content={data.benefit} />}
        {data.testimonials && <ForCreatorsTestimonialsSection content={data.testimonials} />}
        {data.shared.exclusiveTalents && <ExclusiveTalentsSectionV2 content={data.shared.exclusiveTalents} />}
        {data.cta && <ForCreatorsCTASection content={data.cta} />}
      </MainContent>
      {data.shared.contactCta && <ContactCTASectionV2 content={data.shared.contactCta} />}
      {data.globals.footer && <FooterV2 content={data.globals.footer} />}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background: ${colors.white};
  box-shadow: 0px 4.5px 225px rgba(6, 21, 48, 0.6);
  overflow-x: hidden;
  font-family: 'Montserrat', 'Inter', sans-serif;
`;

const MainContent = styled.main`
  width: 100%;
`;
