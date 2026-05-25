'use client';

import styled from 'styled-components';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { colors, typography } from '@/styles/tokens';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '@/lib/cms/types';
import { HeroSection } from './sections/HeroSection';
import { SolutionsSection } from './sections/SolutionsSection';
import { CaseStudiesSection } from './sections/CaseStudiesSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { ProgressSection } from './sections/ProgressSection';
import { CtaSection } from './sections/CtaSection';

export interface ForBrandsHeroContent {
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
}

export interface ForBrandsSolutionsContent {
  title: string;
  items: [string, string, string, string];
}

export interface ForBrandsCaseStudiesContent {
  title: string;
  brandCountLabel?: string;
  brandCards: Array<{
    name: string;
    handle: string;
    photo?: string;
    photoAlt?: string;
    description: string;
    brandCardStat: string;
    stats?: Array<{ value: string; label: string }>;
    isFeatured: boolean;
  }>;
}

export interface ForBrandsCategoriesContent {
  categories: string[];
}

export interface ForBrandsProgressContent {
  title: string;
  subtitle: string;
  steps: Array<{ title: string; description: string }>;
}

export interface ForBrandsCtaContent {
  heading: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface ForBrandsViewModel {
  hero: ForBrandsHeroContent | null;
  solutions: ForBrandsSolutionsContent | null;
  caseStudies: ForBrandsCaseStudiesContent | null;
  categories: ForBrandsCategoriesContent | null;
  progress: ForBrandsProgressContent | null;
  cta: ForBrandsCtaContent | null;
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
        {data.hero ? <HeroSection content={data.hero} /> : null}
        {data.solutions ? <SolutionsSection content={data.solutions} /> : null}
        {data.caseStudies ? <CaseStudiesSection content={data.caseStudies} /> : null}
        {data.categories ? <CategoriesSection content={data.categories} /> : null}
        {data.progress ? <ProgressSection content={data.progress} /> : null}
        {data.cta ? (
          <CtaContainer>
            <CtaSection content={data.cta} />
          </CtaContainer>
        ) : null}
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
