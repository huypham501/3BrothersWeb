'use client';

import styled from "styled-components";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
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
      <div className="wrapper">
        <Header />
        <main className="main-content">
          <ForBrandsHeroSection />
          <ForBrandsInformationSection />
          <ForBrandsDiscoverSection />
          <ForBrandsServicesSection />
          <ForBrandsBrandsSection />
          <ForBrandsCampaignsSection />
          <ForBrandsNewsletterSection />
        </main>
        <Footer />
      </div>
    </PageRoot>
  );
}

const PageRoot = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
`;

