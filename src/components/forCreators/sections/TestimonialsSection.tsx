'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';
import { ForCreatorsTestimonialsPayload } from '@/lib/cms/types';

const TESTIMONIALS_BG_IMAGE = '/images/for-creators/testimonials-v2-bg.png';
// const TESTIMONIALS_BG_IMAGE = '/images/for-creators/testimonials-v2-bg.svg';
const TESTIMONIALS_BG_ASPECT_RATIO = '1440 / 1087';
const TESTIMONIALS_BG_WIDTH = '1440px';

export function TestimonialsSection({ content }: { content: ForCreatorsTestimonialsPayload }) {
  return (
    <SectionContainer>
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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: ${TESTIMONIALS_BG_WIDTH};
    height: auto;
    aspect-ratio: ${TESTIMONIALS_BG_ASPECT_RATIO};
    transform: translateX(-50%);
    background-image: url('${TESTIMONIALS_BG_IMAGE}');
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% auto;
    -webkit-mask-image:
      linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%),
      linear-gradient(to bottom, black 0%, black 82%, transparent 100%);
    mask-image:
      linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%),
      linear-gradient(to bottom, black 0%, black 82%, transparent 100%);
    -webkit-mask-repeat: no-repeat, no-repeat;
    mask-repeat: no-repeat, no-repeat;
    -webkit-mask-size: 100% 100%, 100% 100%;
    mask-size: 100% 100%, 100% 100%;
    -webkit-mask-composite: source-in;
    mask-composite: intersect;
    pointer-events: none;
    z-index: 0;
  }

  ${mediaQueries.down.lg} {
    padding: 80px 0 100px;
    min-height: auto;
  }

  ${mediaQueries.down.sm} {
    padding: 60px 0 80px;

    &::before {
      background-position: center -20px;
    }
  }
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
