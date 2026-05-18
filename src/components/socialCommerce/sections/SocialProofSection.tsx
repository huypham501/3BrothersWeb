'use client';

import styled from 'styled-components';
import { colors, typography, mediaQueries } from '@/styles/tokens';
import type { SocialCommerceSocialProofPayload } from '@/lib/cms/types';

export function SocialProofSection({ content }: { content: SocialCommerceSocialProofPayload }) {
  return (
    <SectionContainer>
      <Inner>
        <Header>
          <Title>{content.section_title}</Title>
          <Subtitle>{content.section_subtitle}</Subtitle>
        </Header>

        <CardsGrid>
          {content.items.map((item) => (
            <ServiceCard key={item.id}>
              <IconBox aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M10 24h28M24 10l14 14-14 14"
                    stroke="#003CA6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconBox>
              <CardContent>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </ServiceCard>
          ))}
        </CardsGrid>
      </Inner>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  background: ${colors.bgBrandSubtle};
  display: flex;
  justify-content: center;
  padding: 96px 0 120px;

  ${mediaQueries.down.lg} {
    padding: 72px 0 88px;
  }

  ${mediaQueries.down.sm} {
    padding: 56px 0 72px;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;

  ${mediaQueries.down.lg} {
    padding: 0 40px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 20px;
    gap: 36px;
  }
`;

const Header = styled.div`
  max-width: 909px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
  color: ${colors.primary};

  ${mediaQueries.down.md} {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: rgba(6, 21, 48, 0.8);
`;

const CardsGrid = styled.div`
  width: 100%;
  max-width: 1280px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;

  ${mediaQueries.down.lg} {
    gap: 24px;
  }

  ${mediaQueries.down.sm} {
    gap: 20px;
  }
`;

const ServiceCard = styled.article`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 32px;
  gap: 24px;
  width: 100%;
  max-width: 405.33px;
  flex: 0 1 405.33px;
  min-height: 253px;
  background: ${colors.white};
  box-shadow: 0px 4px 24px rgba(6, 21, 48, 0.04);
  border-radius: 44px;

  ${mediaQueries.down.sm} {
    max-width: none;
    flex-basis: 100%;
  }
`;

const IconBox = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: rgba(180, 207, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 18px;
  line-height: 140%;
  color: ${colors.secondaryDark};
`;

const CardDescription = styled.p`
  margin: 0;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: rgba(6, 21, 48, 0.8);
`;
