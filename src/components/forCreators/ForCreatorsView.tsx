'use client';

import styled from 'styled-components';
import { colors, typography } from '@/styles/tokens';
import type { ReactNode } from 'react';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { HeroSection } from './sections/HeroSection';
import { BenefitSection } from './sections/BenefitSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ExclusiveTalentsSection } from '@/components/home/sections/ExclusiveTalentsSection';
import type { ForCreatorsViewModel } from '@/lib/cms/resolvers/for-creators.resolver';

export function ForCreatorsView({
  data,
  ctaSectionSlot,
}: {
  data: ForCreatorsViewModel | null;
  ctaSectionSlot?: ReactNode;
}) {
  if (!data) return null;

  return (
    <Wrapper>
      {data.globals.header && <Header content={data.globals.header} />}
      <MainContent>
        {data.hero && <HeroSection content={data.hero} />}
        {data.benefit && <BenefitSection content={data.benefit} />}
        <BlueGroupWrapper>
          {data.testimonials && <TestimonialsSection content={data.testimonials} />}
          <BlueGroupAmbient data-ambient="true" aria-hidden="true">
            <BlueGroupAmbientBefore />
            <BlueGroupAmbientAfter />
          </BlueGroupAmbient>
          {data.shared.exclusiveTalents && <ExclusiveTalentsSection content={data.shared.exclusiveTalents} />}
          {ctaSectionSlot}
        </BlueGroupWrapper>
      </MainContent>
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
  font-family: ${typography.fontFamily.montserrat};
`;

const MainContent = styled.main`
  width: 100%;
`;

const BlueGroupWrapper = styled.div`
  position: relative;
  isolation: isolate;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: visible;
  background: linear-gradient(
    180deg,
    #b4cfff 0%,
    #b4cfff 34%,
    #9cbcf5 42%,
    #82acef 50%,
    ${colors.primaryLight} 58%,
    ${colors.primaryLight} 100%
  );

`;

const BlueGroupAmbient = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
`;

const BlueGroupAmbientLayer = styled.div`
  position: absolute;
  left: 50%;
  width: min(1440px, 100%);
  border-radius: 120px;
  transform: translateX(-50%);
`;

const BlueGroupAmbientBefore = styled(BlueGroupAmbientLayer)`
  top: 30%;
  height: 1281px;
  background: #061530;
  filter: blur(100px);

  @media (max-width: 900px) {
    height: 86vw;
    border-radius: 60px;
    filter: blur(56px);
  }
`;

const BlueGroupAmbientAfter = styled(BlueGroupAmbientLayer)`
  top: 33%;
  height: 1072px;
  background: #003ca6;
  filter: blur(60px);

  @media (max-width: 900px) {
    height: 72vw;
    border-radius: 60px;
    filter: blur(36px);
  }
`;
