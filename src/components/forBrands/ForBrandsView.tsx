'use client';

import styled from 'styled-components';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { colors, typography } from '@/styles/tokens';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '@/lib/cms/types';
import { HeroSection } from './sections/HeroSection';
import { SolutionsSection } from './sections/SolutionsSection';
import { CaseStudiesSection } from './sections/CaseStudiesSection';
import { ProgressSection } from './sections/ProgressSection';
import { CtaSection } from './sections/CtaSection';

interface ForBrandsHeroContent {
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
}

interface ForBrandsSolutionsContent {
  title: string;
  items: [string, string, string, string];
}

interface ForBrandsCaseStudiesContent {
  eyebrow: string;
  title: string;
  featuredBrand: string;
  featuredProject: string;
  featuredStats: Array<{ value: string; label: string }>;
  featuredDescription: string;
  categories: string[];
  brandCards: Array<{ brand: string; metric: string; active?: boolean }>;
}

interface ForBrandsProgressContent {
  title: string;
  subtitle: string;
  steps: Array<{ title: string; description: string }>;
}

interface ForBrandsCtaContent {
  heading: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface ForBrandsViewModel {
  hero: ForBrandsHeroContent;
  solutions: ForBrandsSolutionsContent;
  caseStudies: ForBrandsCaseStudiesContent;
  progress: ForBrandsProgressContent;
  cta: ForBrandsCtaContent;
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
        <SolutionsSection content={data.solutions} />
        <CaseStudiesSection content={data.caseStudies} />
        <ProgressSection content={data.progress} />
        <CtaContainer>
          <CtaSection content={data.cta} />
        </CtaContainer>
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
  font-family: ${typography.fontFamily.montserrat};
`;

const MainContent = styled.main`
  width: 100%;
`;

const CtaContainer = styled.div`
  width: 100%;
  background: ${colors.primaryLight};
`;
