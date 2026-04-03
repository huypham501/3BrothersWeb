'use client';

import styled from "styled-components";
import { GetInTouchNewsletterSection } from "@/components/sections/GetInTouchNewsletterSection";
import { PassionCrewSection } from "@/components/sections/PassionCrewSection";
import { HeaderV2 } from "@/components/home-v2/shared/HeaderV2";
import { FooterV2 } from "@/components/home-v2/shared/FooterV2";
import { ForCreatorsCtaSection } from "@/components/forCreators/sections/ForCreatorsCtaSection";
import { ForCreatorsGrowSection } from "@/components/forCreators/sections/ForCreatorsGrowSection";
import { ForCreatorsHeroSection } from "@/components/forCreators/sections/ForCreatorsHeroSection";
import { ForCreatorsOfferSection } from "@/components/forCreators/sections/ForCreatorsOfferSection";

export function ForCreatorsView() {
  return (
    <PageRoot>
      <HeaderV2 />
      <MainContent>
        <ForCreatorsHeroSection />
        <ForCreatorsGrowSection />
        <ForCreatorsOfferSection />
        <ForCreatorsCtaSection />
        <PassionCrewSection />
        <GetInTouchNewsletterSection />
      </MainContent>
      <FooterV2 />
    </PageRoot>
  );
}


const PageRoot = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-x: hidden;
`;

const MainContent = styled.main`
  width: 100%;
  padding-top: 164px; /* offset for fixed header height */
`;
