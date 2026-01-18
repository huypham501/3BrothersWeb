'use client';

import styled from "styled-components";
import { GetInTouchNewsletterSection } from "@/components/sections/GetInTouchNewsletterSection";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { OurBrandHeaderSection } from "@/components/ourBrand/sections/OurBrandHeaderSection";
import { OurBrandsSection } from "@/components/ourBrand/sections/OurBrandsSection";

export function OurBrandView() {
  return (
    <PageRoot>
      <div className="wrapper">
        <Header />
        <main className="main-content">
          <OurBrandHeaderSection />
          <OurBrandsSection />
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
