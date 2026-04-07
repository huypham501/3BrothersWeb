'use client';

import styled from "styled-components";
import { GetInTouchNewsletterSection } from "@/components/sections/GetInTouchNewsletterSection";
import { HeaderV2 } from "@/components/home-v2/shared/HeaderV2";
import { FooterV2 } from "@/components/home-v2/shared/FooterV2";
import { OurBrandHeaderSection } from "@/components/ourBrand/sections/OurBrandHeaderSection";
import { OurBrandsSection } from "@/components/ourBrand/sections/OurBrandsSection";

export function OurBrandView() {
  return (
    <PageRoot>
      <HeaderV2 />
      <MainContent>
        <OurBrandHeaderSection />
        <OurBrandsSection />
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
`;
