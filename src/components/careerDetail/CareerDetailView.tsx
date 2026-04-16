'use client';

import styled from 'styled-components';
import { notFound } from 'next/navigation';

import { HeaderV2 } from '@/components/home-v2/shared/HeaderV2';
import { FooterV2 } from '@/components/home-v2/shared/FooterV2';
import { ContactCTASectionV2 } from '@/components/home-v2/sections/ContactCTASectionV2';
import { CareerDetailHeroSection } from './sections/CareerDetailHeroSection';
import { CareerDetailMainSection } from './sections/CareerDetailMainSection';
import { CareerDetailExploreSection } from './sections/CareerDetailExploreSection';
import { getJobBySlug } from '../careers/data/jobPositions';

// ── Props ─────────────────────────────────────────────────────────────────────

interface CareerDetailViewProps {
  slug: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CareerDetailView({ slug }: CareerDetailViewProps) {
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <Wrapper>
      <HeaderV2 />
      <MainContent>
        <CareerDetailHeroSection job={job} />
        <CareerDetailMainSection job={job} />
        <CareerDetailExploreSection currentSlug={slug} />
      </MainContent>
      <ContactCTASectionV2 />
      <FooterV2 />
    </Wrapper>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background: #F4F8FF;
  box-shadow: 0px 4.5px 225px rgba(6, 21, 48, 0.6);
  overflow-x: hidden;
  font-family: 'Montserrat', 'Inter', sans-serif;
`;

const MainContent = styled.main`
  width: 100%;
  padding-top: 120px; /* offset for fixed header */
`;
