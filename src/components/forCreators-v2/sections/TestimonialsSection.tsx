'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';
import { ForCreatorsTestimonialsPayload } from '@/lib/cms/types';

export function TestimonialsSection({ content }: { content: ForCreatorsTestimonialsPayload }) {
  return (
    <SectionContainer>
      <StripeOverlay />

      <Inner>
        <HeadingBlock>
          <Superlabel>{content.superlabel}</Superlabel>
          <SectionTitle>{content.section_title}</SectionTitle>
        </HeadingBlock>

        <CardsRow>
          {content.testimonials.map((t, idx) => (
            <TestimonialCard key={`${t.name}-${idx}`}>
              <CardInner>
                <QuoteText>{t.quote}</QuoteText>
                <Divider />
                <AuthorBlock>
                  <AuthorName>{t.name}</AuthorName>
                  <AuthorRole>{t.role}</AuthorRole>
                </AuthorBlock>
              </CardInner>
            </TestimonialCard>
          ))}
        </CardsRow>
      </Inner>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 600px;
  background: #B4CFFF;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 100px 0 120px;

  ${mediaQueries.down.lg} {
    padding: 80px 0 100px;
    min-height: auto;
  }

  ${mediaQueries.down.sm} {
    padding: 60px 0 80px;
  }
`;

const StripeOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  background: repeating-linear-gradient(
    -68deg,
    transparent 0px,
    transparent 94px,
    rgba(255, 255, 255, 0.22) 94px,
    rgba(255, 255, 255, 0.22) 134px
  );
  mix-blend-mode: overlay;
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;

  ${mediaQueries.down.lg} {
    padding: 0 ${spacing.xl};
    gap: 48px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 ${spacing.lg};
    gap: 40px;
  }
`;

const HeadingBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

const Superlabel = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.primary};
  margin: 0;

  ${mediaQueries.down.sm} {
    font-size: 18px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['6xl']};
  line-height: 140%;
  text-align: center;
  text-transform: uppercase;
  color: ${colors.secondaryDark};
  margin: 0;

  ${mediaQueries.down.lg} {
    font-size: 32px;
  }

  ${mediaQueries.down.sm} {
    font-size: 24px;
  }
`;

const CardsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 32px;
  width: 100%;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    gap: ${spacing.xl};
  }
`;

const TestimonialCard = styled.div`
  flex: 1;
  min-width: 0;
  background: ${colors.white};
  box-shadow: 0px 4px 24px rgba(6, 21, 48, 0.10);
  border-radius: 32px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0px 12px 32px rgba(6, 21, 48, 0.18);
  }
`;

const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 44px 56px;
  gap: 24px;
  height: 100%;

  ${mediaQueries.down.sm} {
    padding: 32px 32px;
  }
`;

const QuoteText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 150%;
  color: ${colors.secondaryDark};
  margin: 0;
  flex: 1;
`;

const Divider = styled.div`
  width: 80px;
  height: 1px;
  background: #B4CFFF;
  flex-shrink: 0;
`;

const AuthorBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const AuthorName = styled.span`
  display: block;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.secondaryDark};
`;

const AuthorRole = styled.span`
  display: block;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 14px;
  line-height: 140%;
  color: ${colors.secondaryDark};
`;
