'use client';

import Link from "next/link";
import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { mq } from "@/styles/mediaQueries";

export function HeroSection() {
  return (
    <HeroSection aria-label="For Brands hero">
      <BannerImageDesktop
        src="/metub/template/images/upload/bg-banner-brand.png"
        width={1440}
        height={664}
        alt="Brand Banner"
        loading="eager"
        decoding="async"
      />
      <BannerImageMobile
        src="/metub/template/images/upload/bg-banner-brand-mb.png"
        width={375}
        height={361}
        alt="Mobile Brand Banner"
        loading="eager"
        decoding="async"
      />

      <BannerCaption>
        <Container>
          <TitleGroup>
            <Title>
              WHERE CREATOR <br />
              PASSION MEETS
            </Title>
            <Title>
              BRANDS ESSENCE
              <br />
              <br />
            </Title>
          </TitleGroup>

          <CaptionLink href="/get-in-touch.html">
            Get in touch <span aria-hidden="true">→</span>
          </CaptionLink>
        </Container>
      </BannerCaption>
    </HeroSection>
  );
}


const HeroSection = styled.section`
  position: relative;
  width: 100%;
`;

const BannerCaption = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.base};
  color: ${({ theme }) => theme.colors.white};
`;

const TitleGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize["7xl"]};
  }
`;

const CaptionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.white};

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    line-height: ${({ theme }) => theme.typography.lineHeight.none};
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const BannerImageDesktop = styled.img`
  display: none;
  width: 100%;
  height: auto;

  ${mq.md} {
    display: block;
  }
`;

const BannerImageMobile = styled.img`
  display: block;
  width: 100%;
  height: auto;

  ${mq.md} {
    display: none;
  }
`;
