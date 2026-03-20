'use client';

import styled from "styled-components";
import { mq } from "@/styles/mediaQueries";

export function ForCreatorsHeroSection() {
  return (
    <HeroSection aria-label="For Creators hero">
      <HeroImageDesktop
        src="/metub/template/images/upload/creator/banner-img-1.png"
        width={1439}
        height={698}
        alt="Creator Banner"
        loading="eager"
        decoding="async"
      />
      <HeroImageMobile
        src="/metub/template/images/upload/creator/banner-img-mb-1.png"
        width={834}
        height={405}
        alt="Mobile Creator Banner"
        loading="eager"
        decoding="async"
      />
    </HeroSection>
  );
}


const HeroSection = styled.section`
  width: 100%;
`;

const HeroImageDesktop = styled.img`
  display: none;
  width: 100%;
  height: auto;

  ${mq.md} {
    display: block;
  }
`;

const HeroImageMobile = styled.img`
  display: block;
  width: 100%;
  height: auto;

  ${mq.md} {
    display: none;
  }
`;
