'use client';

import styled from "styled-components";
import { HeaderV2 } from "@/components/home-v2/shared/HeaderV2";
import { FooterV2 } from "@/components/home-v2/shared/FooterV2";
import { ForBrandsBrandsSection } from "@/components/forBrands/sections/ForBrandsBrandsSection";
import { ForBrandsCampaignsSection } from "@/components/forBrands/sections/ForBrandsCampaignsSection";
import { ForBrandsDiscoverSection } from "@/components/forBrands/sections/ForBrandsDiscoverSection";
import { ForBrandsHeroSection } from "@/components/forBrands/sections/ForBrandsHeroSection";
import { ForBrandsInformationSection } from "@/components/forBrands/sections/ForBrandsInformationSection";
import { ForBrandsNewsletterSection } from "@/components/forBrands/sections/ForBrandsNewsletterSection";
import { ForBrandsServicesSection } from "@/components/forBrands/sections/ForBrandsServicesSection";

export function ForBrandsView() {
  return (
    <PageRoot>
      <HeaderV2 />
      <MainContent>
        <ForBrandsHeroSection />
        <ForBrandsInformationSection />
        <ForBrandsDiscoverSection />
        <ForBrandsServicesSection />
        <ForBrandsBrandsSection />
        <ForBrandsCampaignsSection />
        <ForBrandsNewsletterSection />
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
