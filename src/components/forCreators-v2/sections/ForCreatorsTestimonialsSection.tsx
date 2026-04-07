'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';

// ── Data ──────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: 1,
    quote: '"Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến"',
    name: 'Minh Anh',
    role: 'Beauty creator - 500K follows',
  },
  {
    id: 2,
    quote: '"Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến"',
    name: 'Minh Anh',
    role: 'Beauty creator - 500K follows',
  },
  {
    id: 3,
    quote: '"Tối ưu hoá thu nhập từ nhiều nguồn: Quảng Cáo, hợp tác thương thiệu và bán hàng trực tuyến"',
    name: 'Minh Anh',
    role: 'Beauty creator - 500K follows',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function ForCreatorsTestimonialsSection() {
  return (
    <SectionContainer>
      {/* Diagonal stripe background (CSS-generated to match design) */}
      <StripeOverlay />

      <Inner>
        {/* Superlabel + H2 */}
        <HeadingBlock>
          <Superlabel>Creator nói gì về chúng tôi</Superlabel>
          <SectionTitle>Câu Chuyện Thành Công</SectionTitle>
        </HeadingBlock>

        {/* 3-column testimonial cards */}
        <CardsRow>
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id}>
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

// ── Styled components ─────────────────────────────────────────────────────────

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

/* CSS-generated diagonal stripe pattern — pseudo-element overlay mimicking the design's slanted rectangles */
const StripeOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  /* Multiple diagonal white stripes via repeating-linear-gradient */
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

/* Superlabel + Title stacked */
const HeadingBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

/* "Creator nói gì về chúng tôi" — blue, 26px */
const Superlabel = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.primary}; /* #003CA6 */
  margin: 0;

  ${mediaQueries.down.sm} {
    font-size: 18px;
  }
`;

/* "CÂU CHUYỆN THÀNH CÔNG" — navy, 42px, uppercase, bold */
const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['6xl']}; /* 42px */
  line-height: 140%;
  text-align: center;
  text-transform: uppercase;
  color: ${colors.secondaryDark}; /* #061530 */
  margin: 0;

  ${mediaQueries.down.lg} {
    font-size: 32px;
  }

  ${mediaQueries.down.sm} {
    font-size: 24px;
  }
`;

/* Row of 3 cards */
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

/* Individual white card — 440px × 254px, padding 44px 56px */
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

/* Quote paragraph */
const QuoteText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 150%;
  color: ${colors.secondaryDark};
  margin: 0;
  flex: 1;
`;

/* Short blue separator line */
const Divider = styled.div`
  width: 80px;
  height: 1px;
  background: #B4CFFF;
  flex-shrink: 0;
`;

/* Name + role group */
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
