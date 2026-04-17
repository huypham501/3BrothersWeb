'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';

import { HeaderV2 } from '@/components/home-v2/shared/HeaderV2';
import { FooterV2 } from '@/components/home-v2/shared/FooterV2';
import { HeroSection } from './sections/HeroSection';
import { OpenPositionSection } from './sections/OpenPositionSection';

export function CareersView() {
  return (
    <Wrapper>
      <HeaderV2 />
      <MainContent>
        <HeroSection />
        <OpenPositionSection />
      </MainContent>
      <FooterV2 />
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
  padding-top: 164px; /* offset for fixed header height */
`;
