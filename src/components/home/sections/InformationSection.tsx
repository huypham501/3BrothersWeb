'use client';

import Link from 'next/link';
import { Container } from '@/components/primitives/Container';
import { H3 } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/primitives/Section';
import styled from 'styled-components';
import { mq } from '@/styles/mediaQueries';

export function InformationSection() {
  return (
    <StyledInformationSection>
      <InformationInner>
        <Container>
          <BoxText>
            <H3 $variant="title-2">
              PASSIONS KNOWS NO BORDERS! CLIMB THE CHART & BRING YOUR CREATIVE TO LIFE WITH 3BROTHERS
            </H3>
            <MainText>
              With our expertise of optimization and platforms know-how, we can bring your amazing contents
              to wherever your audience are.
            </MainText>
            <Button 
              as={Link} 
              href="/for-creators" 
              $variant="outlineLight" 
              $rounded
              style={{ textTransform: 'uppercase' }}
            >
              <span>CREATOR PROGRAM</span>
            </Button>
          </BoxText>
        </Container>
      </InformationInner>
    </StyledInformationSection>
  );
}

const StyledInformationSection = styled(Section)`
  overflow: hidden;
`;

const InformationInner = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 50%, ${({ theme }) => theme.colors.secondary} 100%);
  padding: ${({ theme }) => theme.spacing['3xl']} 0;

  ${mq.md} {
    padding: 88px 0;
  }

  ${mq.lg} {
    padding: 120px 0;
  }
`;

const BoxText = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  h3 {
    color: ${({ theme }) => theme.colors.white};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    
    ${mq.md} {
      margin-bottom: 32px;
    }
  }
`;

const MainText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    margin-bottom: 32px;
  }
`;
