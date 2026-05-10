'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';
import type { ReactNode } from 'react';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '@/lib/cms/types';

import { HeroSection } from './sections/HeroSection';
import { GrowthSection } from './sections/GrowthSection';
import { ValuePropositionSection } from './sections/ValuePropositionSection';

interface SocialCommerceViewProps {
  header?: GlobalHeaderPayload | null;
  footer?: GlobalFooterPayload | null;
  ctaSectionSlot?: ReactNode;
}

export function SocialCommerceView({ header, footer, ctaSectionSlot }: SocialCommerceViewProps) {
  return (
    <Wrapper>
      <Header content={header ?? undefined} />
      <MainContent>
        <HeroSection />
        <GrowthSection />
        <ValuePropositionSection />
      </MainContent>
      <BlueGroupWrapper>
        <BlueGroupAmbient data-ambient="true" aria-hidden="true">
          <AmbientDark />
          <AmbientBlue />
        </BlueGroupAmbient>
        {ctaSectionSlot}
      </BlueGroupWrapper>
      <Footer content={footer ?? undefined} />
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
`;

const AmbientDark = styled.div`
  position: absolute;
  left: 50%;
  width: min(1440px, 100%);
  border-radius: 120px;
  transform: translateX(-50%);
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

const AmbientBlue = styled.div`
  position: absolute;
  left: 50%;
  width: min(1440px, 100%);
  border-radius: 120px;
  transform: translateX(-50%);
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
