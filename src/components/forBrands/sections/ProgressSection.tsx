'use client';

import styled from 'styled-components';

import { colors, mediaQueries, spacing, typography } from '@/styles/tokens';
import { ForBrandsViewModel } from '../ForBrandsView';

export function ProgressSection({ content }: { content: ForBrandsViewModel['progress'] }) {
  return (
    <SectionContainer>
      <Inner>
        <HeadingWrap>
          <Title>{content.title}</Title>
          <Subtitle>{content.subtitle}</Subtitle>
        </HeadingWrap>

        <StepsRow>
          {content.steps.map((step, idx) => (
            <StepWrap key={`${step.title}-${idx}`}>
              <StepCard>
                <StepIcon aria-hidden="true">✦</StepIcon>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepCard>
              {idx < content.steps.length - 1 ? <Connector aria-hidden="true">≫</Connector> : null}
            </StepWrap>
          ))}
        </StepsRow>
      </Inner>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  background: #eceff6;
  padding: 120px 0;
`;

const Inner = styled.div`
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  gap: 64px;

  ${mediaQueries.down.sm} {
    padding: 0 16px;
    gap: 40px;
  }
`;

const HeadingWrap = styled.div`
  width: min(909px, 100%);
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${colors.secondaryDark};
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize['6xl']};
  line-height: 140%;
  font-weight: ${typography.fontWeight.bold};
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  margin: 0;
  color: rgba(6, 21, 48, 0.8);
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
`;

const StepsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px;

  ${mediaQueries.down.xl} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${mediaQueries.down.sm} {
    grid-template-columns: 1fr;
  }
`;

const StepWrap = styled.div`
  position: relative;
`;

const StepCard = styled.div`
  min-height: 262px;
  border-radius: 24px;
  background: #f0f4ff;
  border: 1px solid rgba(0, 60, 166, 0.1);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StepIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: ${colors.primary};
  font-size: 30px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepTitle = styled.h3`
  margin: 0;
  color: ${colors.secondaryDark};
  font-family: ${typography.fontFamily.montserrat};
  font-size: 38px;
  line-height: 120%;
  font-weight: ${typography.fontWeight.bold};
`;

const StepDescription = styled.p`
  margin: 0;
  color: rgba(6, 21, 48, 0.7);
  font-family: ${typography.fontFamily.montserrat};
  font-size: 33px;
  line-height: 140%;
`;

const Connector = styled.div`
  position: absolute;
  right: -48px;
  top: 50%;
  transform: translateY(-50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${colors.white};
  color: #b4cfff;
  font-size: 42px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQueries.down.xl} {
    display: none;
  }
`;
