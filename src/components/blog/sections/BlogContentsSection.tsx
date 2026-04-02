'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';
import { useState } from 'react';

// ── Constants ────────────────────────────────────────────────────────────────

const INITIAL_VISIBLE_ROWS = 3;
const ITEMS_PER_ROW = 3;
const INITIAL_VISIBLE = INITIAL_VISIBLE_ROWS * ITEMS_PER_ROW; // 9

const BLOG_POSTS = [
  {
    id: 1,
    title: '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  },
  {
    id: 2,
    title: 'Đồng hành cùng chương trình "Xuân Về Bản Em 2026"',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #D4A020 0%, #E8B830 50%, #F0C840 100%)',
  },
  {
    id: 3,
    title: '3BROTHERS MEDIA x WECHOICE AWARDS 2025',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #C0C8D8 0%, #D8E0EE 50%, #B8C4D4 100%)',
  },
  {
    id: 4,
    title: '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  },
  {
    id: 5,
    title: 'Đồng hành cùng chương trình "Xuân Về Bản Em 2026"',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #D4A020 0%, #E8B830 50%, #F0C840 100%)',
  },
  {
    id: 6,
    title: '3BROTHERS MEDIA x WECHOICE AWARDS 2025',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #C0C8D8 0%, #D8E0EE 50%, #B8C4D4 100%)',
  },
  {
    id: 7,
    title: '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  },
  {
    id: 8,
    title: 'Đồng hành cùng chương trình "Xuân Về Bản Em 2026"',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #D4A020 0%, #E8B830 50%, #F0C840 100%)',
  },
  {
    id: 9,
    title: '3BROTHERS MEDIA x WECHOICE AWARDS 2025',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #C0C8D8 0%, #D8E0EE 50%, #B8C4D4 100%)',
  },
  {
    id: 10,
    title: '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  },
  {
    id: 11,
    title: 'Đồng hành cùng chương trình "Xuân Về Bản Em 2026"',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #D4A020 0%, #E8B830 50%, #F0C840 100%)',
  },
  {
    id: 12,
    title: '3BROTHERS MEDIA x WECHOICE AWARDS 2025',
    date: '12 JAN 2026',
    imageBg: 'linear-gradient(135deg, #C0C8D8 0%, #D8E0EE 50%, #B8C4D4 100%)',
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export function BlogContentsSection() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [isExpanded, setIsExpanded] = useState(false);

  const visiblePosts = BLOG_POSTS.slice(0, visibleCount);
  const hasMore = visibleCount < BLOG_POSTS.length;

  const handleToggle = () => {
    if (isExpanded) {
      setVisibleCount(INITIAL_VISIBLE);
      setIsExpanded(false);
    } else {
      setVisibleCount(BLOG_POSTS.length);
      setIsExpanded(true);
    }
  };

  return (
    <SectionContainer>
      {/* Heading row */}
      <HeadingRow>
        <SectionTitle>TẤT CẢ BÀI ĐĂNG</SectionTitle>
      </HeadingRow>

      {/* Cards grid — rows of 3 */}
      <ContentArea>
        {Array.from({ length: Math.ceil(visiblePosts.length / ITEMS_PER_ROW) }).map((_, rowIdx) => {
          const rowPosts = visiblePosts.slice(rowIdx * ITEMS_PER_ROW, rowIdx * ITEMS_PER_ROW + ITEMS_PER_ROW);
          return (
            <CardsRow key={rowIdx} $isLast={rowIdx === Math.ceil(visiblePosts.length / ITEMS_PER_ROW) - 1}>
              {rowPosts.map((post) => (
                <BlogCard key={post.id}>
                  <CardImageWrapper>
                    <CardImage $bg={post.imageBg} />
                  </CardImageWrapper>
                  <CardText>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDate>{post.date}</CardDate>
                  </CardText>
                </BlogCard>
              ))}
            </CardsRow>
          );
        })}
      </ContentArea>

      {/* Xem thêm / Thu gọn button */}
      <ButtonWrapper>
        <LoadMoreButton onClick={handleToggle}>
          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          <ChevronIcon $rotated={isExpanded}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ChevronIcon>
        </LoadMoreButton>
      </ButtonWrapper>
    </SectionContainer>
  );
}

// ── Styled Components ────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  width: 100%;
  padding: 80px 84px;
  background: ${colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  ${mediaQueries.down.lg} {
    padding: 60px ${spacing.xl};
  }

  ${mediaQueries.down.sm} {
    padding: 48px ${spacing.lg};
    gap: ${spacing.xl};
  }
`;

const HeadingRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: ${spacing.xl};
  width: 100%;
  max-width: 1280px;
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
    font-size: ${typography.fontSize['2xl']};
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 20px;
  width: 100%;
  max-width: 1280px;
`;

const CardsRow = styled.div<{ $isLast: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0 ${({ $isLast }) => ($isLast ? '0' : '24px')};
  gap: 33px;
  width: 100%;
  border-bottom: ${({ $isLast }) => ($isLast ? 'none' : `1px solid ${colors.borderLight}`)};

  ${mediaQueries.down.lg} {
    flex-direction: column;
    border-bottom: none;
    padding-bottom: 0;
    gap: ${spacing.xl};
  }
`;

const BlogCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 20px;
  flex: 1;
  min-width: 0;
  text-decoration: none;
  cursor: pointer;
  transition: transform ${motion.duration.base} ease;

  &:hover {
    transform: translateY(-6px);
  }

  ${mediaQueries.down.lg} {
    width: 100%;
    flex: none;
  }
`;

const CardImageWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 268px;
  border: 1px solid ${colors.white};
  border-radius: ${borderRadius.xl};
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
`;

const CardImage = styled.div<{ $bg: string }>`
  position: absolute;
  inset: 0;
  background: ${({ $bg }) => $bg};
  background-size: cover;
  background-position: center;
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 12px;
  width: 100%;
`;

const CardTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['2xl']};
  line-height: 140%;
  color: #061530;
  margin: 0;
  /* Allow two lines max before truncation */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const CardDate = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.normal};
  font-size: 12px;
  line-height: 140%;
  text-transform: uppercase;
  color: #061530;
  opacity: 0.8;
`;

// ── Load more button ──────────────────────────────────────────────────────────

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 21.33px;
  margin-top: ${spacing.md};
`;

const LoadMoreButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  gap: 12px;
  isolation: isolate;

  width: 184px;
  height: 54px;

  background: ${colors.primary};
  border-radius: 48px;
  border: none;
  cursor: pointer;

  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.white};

  transition: background ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  &:hover {
    background: ${colors.primaryHover};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ChevronIcon = styled.span<{ $rotated: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform ${motion.duration.slow} ease;
  transform: ${({ $rotated }) => ($rotated ? 'rotate(180deg)' : 'rotate(0deg)')};
  z-index: 2;
`;
