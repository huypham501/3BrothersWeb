'use client';

import styled from "styled-components";
import { GetInTouchNewsletterSection } from "@/components/sections/GetInTouchNewsletterSection";
import { PassionCrewSection } from "@/components/sections/PassionCrewSection";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { ForCreatorsCtaSection } from "@/components/forCreators/sections/ForCreatorsCtaSection";
import { ForCreatorsGrowSection } from "@/components/forCreators/sections/ForCreatorsGrowSection";
import { ForCreatorsHeroSection } from "@/components/forCreators/sections/ForCreatorsHeroSection";
import { ForCreatorsOfferSection } from "@/components/forCreators/sections/ForCreatorsOfferSection";

export function ForCreatorsView() {
  return (
    <PageRoot>
      <div className="wrapper">
        <Header />
        <main className="main-content">
          <ForCreatorsHeroSection />
          <ForCreatorsGrowSection />
          <ForCreatorsOfferSection />
          <ForCreatorsCtaSection />
          <PassionCrewSection />
          <GetInTouchNewsletterSection />
        </main>
        <Footer />
      </div>
    </PageRoot>
  );
}


const PageRoot = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
`;
