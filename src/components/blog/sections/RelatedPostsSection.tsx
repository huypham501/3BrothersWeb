'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import { BlogPostCard, type BlogPost } from '@/components/blog/components/BlogPostCard';

// ── Placeholder related posts (replace with real API call using current slug) ─

const RELATED_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: '2025-tang-toc-media-he-sinh-thai-influence',
    title: '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence',
    date: '12 Jan 2026',
    imageBg: 'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  },
  {
    id: 2,
    slug: 'dong-hanh-xuan-ve-ban-em-2026',
    title: 'Đồng hành cùng chương trình "Xuân Về Bản Em 2026"',
    date: '12 Jan 2026',
    imageBg: 'linear-gradient(135deg, #D4A020 0%, #E8B830 50%, #F0C840 100%)',
  },
  {
    id: 3,
    slug: '3brothers-media-x-wechoice-awards-2025',
    title: '3BROTHERS MEDIA x WECHOICE AWARDS 2025',
    date: '12 Jan 2026',
    imageBg: 'linear-gradient(135deg, #C0C8D8 0%, #D8E0EE 50%, #B8C4D4 100%)',
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface RelatedPostsSectionProps {
  /** Pass-in related posts from real data instead of the placeholder above */
  posts?: BlogPost[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RelatedPostsSection({ posts = RELATED_POSTS }: RelatedPostsSectionProps) {
  return (
    <SectionContainer>
      <Inner>
        {/* Section heading */}
        <Heading>
          <SectionTitle>Bài viết liên quan</SectionTitle>
        </Heading>

        {/* 3-card row */}
        <CardsRow>
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </CardsRow>
      </Inner>
    </SectionContainer>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  width: 100%;
  background: ${colors.white};
  padding: 0 0 80px;

  ${mediaQueries.down.lg} {
    padding-bottom: 60px;
  }

  ${mediaQueries.down.sm} {
    padding-bottom: 48px;
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 1280px;
  /* Centered, with 80px margin matching the design left: calc(50% - 1280px/2 + 4px) */
  margin: 0 auto;
  padding: 0 80px;

  ${mediaQueries.down.lg} {
    padding: 0 ${spacing.xl};
  }

  ${mediaQueries.down.sm} {
    padding: 0 ${spacing.lg};
  }
`;

/* Heading row */
const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 32px;
  width: 100%;
  height: 36px;
`;

const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  text-transform: uppercase;
  color: #181A2A;
  margin: 0;
  flex: 1;

  ${mediaQueries.down.sm} {
    font-size: 20px;
  }
`;

/* Cards row — no bottom border, no Xem thêm */
const CardsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0 0 24px;
  gap: 33px;
  width: 100%;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    padding-bottom: 0;
    gap: ${spacing.xl};
  }
`;
