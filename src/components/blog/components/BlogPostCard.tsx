'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, borderRadius, typography, motion } from '@/styles/tokens';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  imageBg: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <CardLink href={`/blogs/${post.slug}`}>
      <CardImageWrapper>
        <CardImage $bg={post.imageBg} />
      </CardImageWrapper>
      <CardText>
        <CardTitle>{post.title}</CardTitle>
        <CardDate>{post.date}</CardDate>
      </CardText>
    </CardLink>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

export const CardLink = styled(Link)`
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
`;

export const CardImageWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 268px;
  border: 1px solid ${colors.white};
  border-radius: ${borderRadius.xl}; /* 24px */
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
`;

export const CardImage = styled.div<{ $bg: string }>`
  position: absolute;
  inset: 0;
  background: ${({ $bg }) => $bg};
  background-size: cover;
  background-position: center;
  transition: transform ${motion.duration.slow} ease;

  ${CardLink}:hover & {
    transform: scale(1.04);
  }
`;

export const CardText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 12px;
  width: 100%;
`;

export const CardTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.bold};
  font-size: 24px;
  line-height: 140%;
  color: #061530;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

export const CardDate = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: ${typography.fontWeight.normal};
  font-size: 12px;
  line-height: 140%;
  text-transform: uppercase;
  color: #061530;
  opacity: 0.8;
`;
