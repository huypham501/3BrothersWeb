'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ContactCTASection } from '@/components/shared/ContactCTASection';
import { HeroSection } from './sections/HeroSection';
import { BenefitSection } from './sections/BenefitSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ExclusiveTalentsSection } from '@/components/home/sections/ExclusiveTalentsSection';
import { CTASection } from './sections/CTASection';
import type { ForCreatorsViewModel } from '@/lib/cms/resolvers/for-creators.resolver';

export function ForCreatorsView({ data }: { data: ForCreatorsViewModel | null }) {
  if (!data) return null;

  return (
    <Wrapper>
      {data.globals.header && <Header content={data.globals.header} />}
      <MainContent>
        {data.hero && <HeroSection content={data.hero} />}
        {data.benefit && <BenefitSection content={data.benefit} />}
        {data.testimonials && <TestimonialsSection content={data.testimonials} />}
        {data.shared.exclusiveTalents && <ExclusiveTalentsSection content={data.shared.exclusiveTalents} />}
        {data.cta && <CTASection content={data.cta} />}
      </MainContent>
      {data.shared.contactCta && <ContactCTASection content={data.shared.contactCta} />}
      {data.globals.footer && <Footer content={data.globals.footer} />}
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
