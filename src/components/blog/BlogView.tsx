'use client';

import styled from 'styled-components';
import { colors, typography } from '@/styles/tokens';
import type { ReactNode } from 'react';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { HighlightsSection, type FeaturedPost } from './sections/HighlightsSection';
import { ContentsSection } from './sections/ContentsSection';
import type { BlogPost } from './components/BlogPostCard';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '@/lib/cms/types';

interface BlogViewProps {
  featuredPost?: FeaturedPost;
  posts?: BlogPost[];
  header?: GlobalHeaderPayload | null;
  footer?: GlobalFooterPayload | null;
  contactCtaSlot?: ReactNode;
}

export function BlogView({ featuredPost, posts, header, footer, contactCtaSlot }: BlogViewProps) {
  return (
    <Wrapper>
      <Header content={header ?? undefined} />
      <MainContent>
        <HighlightsSection featuredPost={featuredPost} />
        <ContentsSection posts={posts} />
        <ContactCTAContainer>
          {contactCtaSlot}
        </ContactCTAContainer>
      </MainContent>
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

const ContactCTAContainer = styled.div`
  width: 100%;
  background: ${colors.primaryLight};
`;
