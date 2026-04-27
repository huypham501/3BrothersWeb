'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { HeroSection } from './sections/HeroSection';
import { OpenPositionSection } from './sections/OpenPositionSection';
import type { CareersHeroPayload } from '@/lib/cms/types/payloads';
import type { JobPosition } from './data/jobPositions';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '@/lib/cms/types';

interface CareersViewProps {
  hero?: CareersHeroPayload | null;
  positions?: JobPosition[];
  header?: GlobalHeaderPayload | null;
  footer?: GlobalFooterPayload | null;
}

export function CareersView({ hero, positions, header, footer }: CareersViewProps) {
  return (
    <Wrapper>
      <Header content={header ?? undefined} />
      <MainContent>
        <HeroSection hero={hero} />
        <OpenPositionSection positions={positions} />
      </MainContent>
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
  padding-top: 164px; /* offset for fixed header height */
`;
