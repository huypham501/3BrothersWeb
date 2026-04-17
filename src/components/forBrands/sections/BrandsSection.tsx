'use client';

import Link from "next/link";
import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/Button";
import { mq } from "@/styles/mediaQueries";

const BRANDS = [
  "/metub/template/images/upload/brand-1.png",
  "/metub/template/images/upload/brand-2.png",
  "/metub/template/images/upload/brand-3.png",
  "/metub/template/images/upload/brand-4.png",
  "/metub/template/images/upload/brand-5.png",
  "/metub/template/images/upload/brand-6.png",
  "/metub/template/images/upload/brand-7.png",
  "/metub/template/images/upload/brand-8.png",
  "/metub/template/images/upload/brand-9.png",
  "/metub/template/images/upload/brand-16.png",
  "/metub/template/images/upload/brand-17.png",
  "/metub/template/images/upload/brand-12.png",
  "/metub/template/images/upload/brand-13.png",
  "/metub/template/images/upload/brand-14.png",
  "/metub/template/images/upload/brand-15.png",
] as const;

export function BrandsSection() {
  return (
    <BrandsSection aria-label="Brands">
      <BrandsTop>
        <Container>
          <Heading>
            <HeadingTitle>
              WE DO IT FOR THEM. <br />
              <span>NOW WE MAKE YOU SUCCESS. </span>
            </HeadingTitle>
          </Heading>

          <BrandsGrid>
            {BRANDS.map((src) => (
              <BrandItem key={src}>
                <BrandLogo src={src} width={218} height={120} alt="Brand" loading="lazy" />
              </BrandItem>
            ))}
          </BrandsGrid>
        </Container>
      </BrandsTop>

      <BrandsBottom>
        <Container>
          <BottomTitle>LEVEL UP YOUR BRAND</BottomTitle>
          <Button as={Link} href="/get-in-touch.html" $variant="outlineLight" $rounded $size="xl">
            <span>GET IN TOUCH</span>
          </Button>
        </Container>
      </BrandsBottom>
    </BrandsSection>
  );
}


const BrandsSection = styled.section`
  background-color: ${({ theme }) => theme.colors.bgDark};
  background-image: url(/metub/template/images/bg/bg-brands.png);
  background-size: cover;
  background-position: center;
  color: ${({ theme }) => theme.colors.white};
`;

const BrandsTop = styled.div`
  padding: ${({ theme }) => theme.spacing["5xl"]} 0;

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing["6xl"]} 0;
  }
`;

const Heading = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
`;

const HeadingTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};

  span {
    color: ${({ theme }) => theme.colors.secondary};
  }

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  }
`;

const BrandsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  ${mq.md} {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

const BrandItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: rgba(255, 255, 255, 0.06);
`;

const BrandLogo = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const BrandsBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  padding: ${({ theme }) => theme.spacing["4xl"]} 0;
  text-align: center;
`;

const BottomTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  }
`;
