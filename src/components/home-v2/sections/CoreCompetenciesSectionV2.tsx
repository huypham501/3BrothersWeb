'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';
import { CoreCompetencyCard } from '../components/CoreCompetencyCard';

import { HomeCoreCompetenciesPayload } from '@/lib/cms/types';

export function CoreCompetenciesSectionV2({ content }: { content: HomeCoreCompetenciesPayload }) {
  const SERVICES = content.services || [];

  return (
    <SectionContainer>
      <TitleWrapper>
        <Title>{content.section_title}</Title>
        <TitleSlash />
      </TitleWrapper>
      <GridWrapper>
        <GridLineHorizontal />
        <GridLineVertical />
        <GridContainer>
          {SERVICES.map((service, index) => (
            <CoreCompetencyCard
              key={index}
              title={service.title}
              description={service.description}
            />
          ))}
        </GridContainer>
      </GridWrapper>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  padding: 120px ${spacing['5xl']};
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;

  ${mediaQueries.down.sm} {
    padding: 60px ${spacing.lg};
    gap: 40px;
  }
`;

const TitleWrapper = styled.div`
  width: 100%;
  max-width: 1280px;
  display: flex;
  align-items: center;
  gap: ${spacing['3xl']};

  ${mediaQueries.down.sm} {
    gap: ${spacing.md};
  }
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  text-align: left;
  text-transform: uppercase;
  color: #003CA6;
  margin: ${spacing[0]};
  white-space: nowrap;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['3xl']};
  }
`;

const TitleSlash = styled.div`
  height: 1px;
  flex: 1;
  background: #061530;
  opacity: 0.2;
`;

const GridWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1280px;
`;

const GridLineHorizontal = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #061530;
  opacity: 0.2;
  z-index: 0;

  ${mediaQueries.down.lg} {
    display: none;
  }
`;

const GridLineVertical = styled.div`
  position: absolute;
  top: 0;
  bottom: 40px;
  left: 50%;
  width: 1.5px;
  background: #061530;
  opacity: 0.2;
  z-index: 0;

  ${mediaQueries.down.lg} {
    display: none;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 60px;
  row-gap: 120px;
  width: 100%;
  position: relative;
  z-index: 1;

  ${mediaQueries.down.lg} {
    grid-template-columns: 1fr;
    column-gap: 0;
    row-gap: 60px;
  }
`;


