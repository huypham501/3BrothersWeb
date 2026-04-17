'use client';

import styled from "styled-components";
import { GetInTouchNewsletterSection } from "@/components/sections/GetInTouchNewsletterSection";
import { HeaderV2 } from "@/components/home-v2/shared/HeaderV2";
import { FooterV2 } from "@/components/home-v2/shared/FooterV2";
import { HeaderSection } from "@/components/ourBrand/sections/HeaderSection";
import { BrandsSection } from "@/components/ourBrand/sections/BrandsSection";

export function OurBrandView() {
  return (
    <PageRoot>
      <HeaderV2 />
      <MainContent>
        <HeaderSection />
        <BrandsSection />
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
