'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';
import type { ReactNode } from 'react';
import type { SocialCommerceViewModel } from '@/lib/cms/resolvers/social-commerce.resolver';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

import { HeroSection } from './sections/HeroSection';
import { GrowthSection } from './sections/GrowthSection';
import { SocialProofSection } from './sections/SocialProofSection';
import { ValuePropositionSection } from './sections/ValuePropositionSection';

interface SocialCommerceViewProps {
  data: SocialCommerceViewModel | null;
  ctaSectionSlot?: ReactNode;
}

export function SocialCommerceView({ data, ctaSectionSlot }: SocialCommerceViewProps) {
  if (!data) return null;

  return (
    <Wrapper>
      <Header content={data.globals.header ?? undefined} />
      <MainContent>
        {data.hero && <HeroSection content={data.hero} />}
        {data.socialProof && <SocialProofSection content={data.socialProof} />}
        {data.growth && <GrowthSection content={data.growth} />}
        {data.valueProposition && <ValuePropositionSection content={data.valueProposition} />}
      </MainContent>
      <BlueGroupWrapper>
        {ctaSectionSlot}
      </BlueGroupWrapper>
      <Footer content={data.globals.footer ?? undefined} />
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
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${colors.primaryLight};
`;
