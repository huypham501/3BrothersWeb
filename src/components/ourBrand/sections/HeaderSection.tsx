'use client';

import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { mq } from "@/styles/mediaQueries";

export function HeaderSection() {
  return (
    <HeaderSection>
      <Container>
        <Title>
          OUR <span>BRANDS</span>
        </Title>
        <Subtitle>
          We help brands achieve meaningful growth with intelligent social video advertising. Get
          the engagement you deserve.
        </Subtitle>
      </Container>
    </HeaderSection>
  );
}


const HeaderSection = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing["6xl"]} 0 ${({ theme }) => theme.spacing["3xl"]};

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing["7xl"]} 0 ${({ theme }) => theme.spacing["4xl"]};
  }
`;

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize["6xl"]};
  }
`;

const Subtitle = styled.p`
  margin: 0;
  max-width: 70ch;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.textBody};
`;
