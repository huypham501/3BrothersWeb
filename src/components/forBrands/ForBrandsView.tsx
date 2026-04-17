'use client';

import styled from "styled-components";
import { HeaderV2 } from "@/components/home-v2/shared/HeaderV2";
import { FooterV2 } from "@/components/home-v2/shared/FooterV2";
import { BrandsSection } from "@/components/forBrands/sections/BrandsSection";
import { CampaignsSection } from "@/components/forBrands/sections/CampaignsSection";
import { DiscoverSection } from "@/components/forBrands/sections/DiscoverSection";
import { HeroSection } from "@/components/forBrands/sections/HeroSection";
import { InformationSection } from "@/components/forBrands/sections/InformationSection";
import { NewsletterSection } from "@/components/forBrands/sections/NewsletterSection";
import { ServicesSection } from "@/components/forBrands/sections/ServicesSection";

export function ForBrandsView() {
  return (
    <PageRoot>
      <HeaderV2 />
      <MainContent>
        <HeroSection />
        <InformationSection />
        <DiscoverSection />
        <ServicesSection />
        <BrandsSection />
        <CampaignsSection />
        <NewsletterSection />
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
`;
