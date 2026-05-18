'use client';

import styled from 'styled-components';
import { colors, typography } from '@/styles/tokens';
import type { ReactNode } from 'react';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { DetailMainContentSection, type ArticleData } from './sections/DetailMainContentSection';
import { RelatedPostsSection } from './sections/RelatedPostsSection';
import type { BlogPost } from './components/BlogPostCard';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '@/lib/cms/types';

interface BlogDetailViewProps {
  article?: ArticleData;
  relatedPosts?: BlogPost[];
  header?: GlobalHeaderPayload | null;
  footer?: GlobalFooterPayload | null;
  contactCtaSlot?: ReactNode;
}

export function BlogDetailView({
  article,
  relatedPosts,
  header,
  footer,
  contactCtaSlot,
}: BlogDetailViewProps) {
  return (
    <Wrapper>
      <Header content={header ?? undefined} />
      <MainContent>
        <DetailMainContentSection article={article} />
        <RelatedPostsSection posts={relatedPosts} />
      </MainContent>
      {contactCtaSlot}
      <Footer content={footer ?? undefined} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background: ${colors.white};
  box-shadow: 0px 4.5px 225px rgba(6, 21, 48, 0.6);
  overflow-x: hidden;
  font-family: ${typography.fontFamily.montserrat};
`;

const MainContent = styled.main`
  width: 100%;
`;
