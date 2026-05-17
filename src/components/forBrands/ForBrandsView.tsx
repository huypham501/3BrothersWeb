'use client';

import styled from 'styled-components';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { colors } from '@/styles/tokens';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '@/lib/cms/types';
import { HeroSection } from './sections/HeroSection';

interface ForBrandsHeroContent {
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
}

export interface ForBrandsViewModel {
  hero: ForBrandsHeroContent;
  globals: {
    header?: GlobalHeaderPayload | null;
    footer?: GlobalFooterPayload | null;
  };
}

export function ForBrandsView({ data }: { data: ForBrandsViewModel }) {
  return (
    <Wrapper>
      {data.globals.header ? <Header content={data.globals.header} /> : null}
      <MainContent>
        <HeroSection content={data.hero} />
      </MainContent>
      {data.globals.footer ? <Footer content={data.globals.footer} /> : null}
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
