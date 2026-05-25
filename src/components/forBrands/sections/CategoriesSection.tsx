'use client';

import styled, { css, keyframes } from 'styled-components';

import { mediaQueries, typography } from '@/styles/tokens';
import type { ForBrandsCategoriesContent } from '../ForBrandsView';

export function CategoriesSection({ content }: { content: ForBrandsCategoriesContent }) {
  const categories = content.categories.map((item) => item.trim()).filter(Boolean);
  const shouldAnimateCategories = categories.length >= 4;

  if (categories.length === 0) return null;

  return (
    <CategoryMarquee>
      <CategoryViewport>
        <CategoryTrack data-marquee-track="true" $animate={shouldAnimateCategories}>
          <CategorySet $animate={shouldAnimateCategories}>
            {categories.map((item, idx) => (
              <CategoryToken key={`category-original-${item}-${idx}`}>
                <CategoryIcon aria-hidden="true" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.6663 35V31.6667C26.6663 29.8986 25.964 28.2029 24.7137 26.9526C23.4635 25.7024 21.7678 25 19.9997 25H9.99967C8.23156 25 6.53587 25.7024 5.28563 26.9526C4.03539 28.2029 3.33301 29.8986 3.33301 31.6667V35" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M26.667 5.21289C28.0966 5.58351 29.3626 6.41833 30.2665 7.58633C31.1703 8.75433 31.6607 10.1894 31.6607 11.6662C31.6607 13.1431 31.1703 14.5781 30.2665 15.7461C29.3626 16.9141 28.0966 17.7489 26.667 18.1196" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M36.667 35.0001V31.6668C36.6659 30.1897 36.1743 28.7548 35.2693 27.5873C34.3643 26.4199 33.0972 25.5861 31.667 25.2168" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.9997 18.3333C18.6816 18.3333 21.6663 15.3486 21.6663 11.6667C21.6663 7.98477 18.6816 5 14.9997 5C11.3178 5 8.33301 7.98477 8.33301 11.6667C8.33301 15.3486 11.3178 18.3333 14.9997 18.3333Z" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </CategoryIcon>
                <CategoryItem>{item}</CategoryItem>
              </CategoryToken>
            ))}
          </CategorySet>

          {shouldAnimateCategories ? (
            <CategorySet aria-hidden="true" $animate={shouldAnimateCategories}>
              {categories.map((item, idx) => (
                <CategoryToken key={`category-clone-${item}-${idx}`}>
                  <CategoryIcon aria-hidden="true" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.6663 35V31.6667C26.6663 29.8986 25.964 28.2029 24.7137 26.9526C23.4635 25.7024 21.7678 25 19.9997 25H9.99967C8.23156 25 6.53587 25.7024 5.28563 26.9526C4.03539 28.2029 3.33301 29.8986 3.33301 31.6667V35" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M26.667 5.21289C28.0966 5.58351 29.3626 6.41833 30.2665 7.58633C31.1703 8.75433 31.6607 10.1894 31.6607 11.6662C31.6607 13.1431 31.1703 14.5781 30.2665 15.7461C29.3626 16.9141 28.0966 17.7489 26.667 18.1196" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M36.667 35.0001V31.6668C36.6659 30.1897 36.1743 28.7548 35.2693 27.5873C34.3643 26.4199 33.0972 25.5861 31.667 25.2168" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.9997 18.3333C18.6816 18.3333 21.6663 15.3486 21.6663 11.6667C21.6663 7.98477 18.6816 5 14.9997 5C11.3178 5 8.33301 7.98477 8.33301 11.6667C8.33301 15.3486 11.3178 18.3333 14.9997 18.3333Z" stroke="#83B0FF" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </CategoryIcon>
                  <CategoryItem>{item}</CategoryItem>
                </CategoryToken>
              ))}
            </CategorySet>
          ) : null}
        </CategoryTrack>
      </CategoryViewport>
    </CategoryMarquee>
  );
}

const categoryMarquee = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

const CategoryMarquee = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 0 64px;

  &:hover [data-marquee-track='true'],
  &:focus-within [data-marquee-track='true'] {
    animation-play-state: paused;
  }
`;

const CategoryViewport = styled.div`
  width: 100%;
  overflow: hidden;
`;

const CategoryTrack = styled.div<{ $animate: boolean }>`
  display: flex;
  align-items: center;
  gap: 24px;
  width: ${({ $animate }) => ($animate ? 'max-content' : '100%')};
  animation: ${({ $animate }) => ($animate ? css`${categoryMarquee} 26s linear infinite` : 'none')};
  will-change: transform;

  ${mediaQueries.down.md} {
    animation-duration: ${({ $animate }) => ($animate ? '22s' : '0s')};
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
  }
`;

const CategorySet = styled.div<{ $animate: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $animate }) => ($animate ? 'flex-start' : 'center')};
  gap: 24px;
  width: ${({ $animate }) => ($animate ? 'max-content' : '100%')};
  flex: none;
`;

const CategoryToken = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  flex: none;
`;

const CategoryIcon = styled.svg`
  width: 40px;
  height: 40px;
  flex: none;
`;

const CategoryItem = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-family: ${typography.fontFamily.montserrat};
  font-size: 26px;
  line-height: 140%;
  text-transform: uppercase;
  font-weight: ${typography.fontWeight.bold};
`;
