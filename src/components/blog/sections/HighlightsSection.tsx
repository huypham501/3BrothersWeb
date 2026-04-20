'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FeaturedPost {
  slug: string;
  title: string;
  badge: string | null;
  excerpt: string | null;
  date: string;
  heroBg: string;
}

const DEFAULT_FEATURED: FeaturedPost = {
  slug: '2025-tang-toc-media-he-sinh-thai-influence',
  title: '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence',
  badge: 'Event • Sắp diễn ra',
  excerpt:
    'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime. However, traveling can also be stressful and overwhelming, especially if you don\'t plan and prepare adequately. In this blog…',
  date: '12 Jan 2026',
  heroBg: 'linear-gradient(180deg, #001a5c 0%, #003CA6 35%, #0050d0 60%, #061530 100%)',
};

// ── Component ────────────────────────────────────────────────────────────────

export function HighlightsSection({ featuredPost }: { featuredPost?: FeaturedPost }) {
  const post = featuredPost ?? DEFAULT_FEATURED;
  return (
    <SectionContainer>
      {/* Full-width hero image with dark overlay */}
      <HeroImageWrapper>
        <HeroImage $bg={post.heroBg} />
        <HeroDimmer />
      </HeroImageWrapper>

      {/* White info card overlapping the bottom of the image */}
      <InfoCardLink href={`/blogs/${post.slug}`}>
        <CardHeading>
          {post.badge && (
            <Badge>
              <BadgeText>{post.badge}</BadgeText>
            </Badge>
          )}
          <CardTitle>{post.title}</CardTitle>
        </CardHeading>

        {post.excerpt && (
          <CardArticle>{post.excerpt}</CardArticle>
        )}

        <ShortInfo>
          <DateText>{post.date}</DateText>
        </ShortInfo>
      </InfoCardLink>
    </SectionContainer>
  );
}

// ── Styled components ────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  /* Total height: hero image (710px) + card overlap (≈ 164px below image midpoint) */
  padding-bottom: 80px;
  background: transparent;
`;

/* ─── Hero image ─────────────────────────────────────────────────────────── */

const HeroImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 710px;
  overflow: hidden;
  border-radius: 0 0 120px 120px;

  ${mediaQueries.down.lg} {
    height: 500px;
    border-radius: 0 0 80px 80px;
  }

  ${mediaQueries.down.sm} {
    height: 380px;
    border-radius: 0 0 48px 48px;
  }
`;

const HeroImage = styled.div<{ $bg: string }>`
  position: absolute;
  inset: 0;
  background: ${({ $bg }) => $bg};
  background-size: cover;
  background-position: center top;

  /* Subtle inner glow layers mirroring the design vectors */
  &::before {
    content: '';
    position: absolute;
    width: 74%;
    height: 82%;
    left: -2%;
    bottom: -10%;
    background: #003CA6;
    filter: blur(50px);
    border-radius: 50%;
    opacity: 0.7;
  }

  &::after {
    content: '';
    position: absolute;
    width: 58%;
    height: 61%;
    left: -2%;
    bottom: -5%;
    background: #6395ED;
    filter: blur(17.5px);
    border-radius: 50%;
    opacity: 0.6;
  }
`;

const HeroDimmer = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  pointer-events: none;
`;

/* ─── White info card ────────────────────────────────────────────────────── */

const InfoCardLink = styled(Link)`
  position: absolute;
  bottom: 0;
  left: 84px;
  right: 84px;
  text-decoration: none;
  color: inherit;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px;
  gap: 24px;

  background: ${colors.white};
  box-shadow: 0px 12px 24px -6px rgba(24, 26, 42, 0.12);
  border-radius: ${borderRadius.xl};

  cursor: pointer;
  transition: transform ${motion.duration.base} ease, box-shadow ${motion.duration.base} ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 20px 40px -8px rgba(24, 26, 42, 0.18);
  }

  ${mediaQueries.down.lg} {
    left: ${spacing.xl};
    right: ${spacing.xl};
    padding: 32px;
    gap: 18px;
  }

  ${mediaQueries.down.sm} {
    left: ${spacing.lg};
    right: ${spacing.lg};
    padding: ${spacing.xl};
    gap: ${spacing.md};
  }
`;

const CardHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 16px;
  align-self: stretch;
`;

/* Yellow badge */
const Badge = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  gap: 4px;

  background: ${colors.secondary}; /* #FFE773 */
  border-radius: 24px;
  flex: none;
`;

const BadgeText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.primary};
  white-space: nowrap;
`;

/* Article title */
const CardTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['6xl']}; /* 42px */
  line-height: 140%;
  color: #181A2A;
  margin: 0;
  align-self: stretch;

  ${mediaQueries.down.lg} {
    font-size: ${typography.fontSize['4xl']};
  }

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['2xl']};
  }
`;

/* Excerpt */
const CardArticle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.lg}; /* 18px */
  line-height: 150%;
  color: #000000;
  margin: 0;
  align-self: stretch;

  /* Clamp to two lines to match design */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize.md};
  }
`;

/* Date */
const ShortInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 20px;
`;

const DateText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md}; /* 16px */
  line-height: 140%;
  color: #97989F;
`;
