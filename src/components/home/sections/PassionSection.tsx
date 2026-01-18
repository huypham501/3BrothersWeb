'use client';

import styled from 'styled-components';
import { Container } from '@/components/primitives/Container';
import { Section } from '@/components/primitives/Section';
import { mq } from '@/styles/mediaQueries';

const PassionSectionWrapper = styled(Section)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  
  ${mq.md} {
    padding: ${({ theme }) => theme.spacing['2xl']} 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  
  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  }
  
  &::before {
    content: '.';
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.8;
  text-align: center;
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing['2xl']};
  
  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

export function PassionSection() {
  return (
    <PassionSectionWrapper>
      <Container>
        <SectionTitle>LIVE BY PASSION</SectionTitle>
        
        <Description>
          We believe in the superpower where technology meets creativity, and those
          creators with great passion will spark joy and influence millions other people.
          Together with them, METUB is building a creator economy to helps creators turn their
          passion into a sustainable career by growing their fanbase and enable creator
          earning potentials across platforms through digital content & commerce.
        </Description>
      </Container>
    </PassionSectionWrapper>
  );
}
