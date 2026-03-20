'use client';

import Link from "next/link";
import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/Button";
import { mq } from "@/styles/mediaQueries";

export function ForCreatorsCtaSection() {
  return (
    <CtaSection>
      <Container>
        <CtaContent>
          <CtaTitle>One CLICK AWAY FROM OUR PASSION CREW</CtaTitle>
          <Button as={Link} href="/get-in-touch.html" $variant="outlineLight" $rounded>
            <span>Join NOW</span>
          </Button>
        </CtaContent>
      </Container>
    </CtaSection>
  );
}


const CtaSection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]} 0;
  background-color: ${({ theme }) => theme.colors.bgDark};
  background-image: url(/metub/template/images/bg/bg-section-click.png);
  background-size: cover;
  background-position: center;
`;

const CtaContent = styled.div`
  text-align: center;
`;

const CtaTitle = styled.h2`
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
