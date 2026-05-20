'use client';

import styled from 'styled-components';

import { colors, mediaQueries, spacing, typography } from '@/styles/tokens';
import type { ForBrandsProgressContent } from '../ForBrandsView';

export function ProgressSection({ content }: { content: ForBrandsProgressContent }) {
  return (
    <SectionContainer>
      <Inner>
        <HeadingWrap>
          <Title>{content.title}</Title>
          <Subtitle>{content.subtitle}</Subtitle>
        </HeadingWrap>

        <StepsRow>
          {content.steps.map((step, idx) => (
            <StepWrap key={`${step.title}-${idx}`}>
              <StepCard>
                <StepIcon aria-hidden="true">
                  {idx < 2 ? (
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M32 39.9993V53.3327C32 53.3327 40.08 51.866 42.6667 47.9993C45.5467 43.6793 42.6667 34.666 42.6667 34.666"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.0003 43.9989C8.00033 47.3589 6.66699 57.3322 6.66699 57.3322C6.66699 57.3322 16.6403 55.9989 20.0003 51.9989C21.8937 49.7589 21.867 46.3189 19.7603 44.2389C18.7238 43.2496 17.3584 42.6779 15.9263 42.6336C14.4941 42.5893 13.096 43.0755 12.0003 43.9989Z"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M24 31.9994C25.4191 28.3178 27.2059 24.7889 29.3333 21.466C32.4405 16.498 36.767 12.4075 41.9013 9.5836C47.0357 6.75972 52.8071 5.29635 58.6667 5.33269C58.6667 12.586 56.5867 25.3327 42.6667 34.666C39.2979 36.7952 35.7246 38.5819 32 39.9994L24 31.9994Z"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M24.0003 32.0009H10.667C10.667 32.0009 12.1337 23.9209 16.0003 21.3342C20.3203 18.4542 29.3337 21.4675 29.3337 21.4675"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : idx === 2 ? (
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M42.6663 56V50.6667C42.6663 47.8377 41.5425 45.1246 39.5421 43.1242C37.5418 41.1238 34.8286 40 31.9997 40H15.9997C13.1707 40 10.4576 41.1238 8.4572 43.1242C6.45681 45.1246 5.33301 47.8377 5.33301 50.6667V56"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M42.667 8.33984C44.9543 8.93283 46.98 10.2685 48.4261 12.1373C49.8722 14.0061 50.6569 16.3022 50.6569 18.6652C50.6569 21.0281 49.8722 23.3242 48.4261 25.193C46.98 27.0618 44.9543 28.3975 42.667 28.9905"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M58.667 56.001V50.6677C58.6652 48.3043 57.8786 46.0084 56.4306 44.1405C54.9827 42.2726 52.9553 40.9385 50.667 40.3477"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23.9997 29.3333C29.8907 29.3333 34.6663 24.5577 34.6663 18.6667C34.6663 12.7756 29.8907 8 23.9997 8C18.1086 8 13.333 12.7756 13.333 18.6667C13.333 24.5577 18.1086 29.3333 23.9997 29.3333Z"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : idx === 3 ? (
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M29.3779 7.50518C29.4922 6.89345 29.8168 6.34095 30.2955 5.94336C30.7742 5.54577 31.3769 5.32812 31.9992 5.32812C32.6215 5.32812 33.2242 5.54577 33.703 5.94336C34.1817 6.34095 34.5063 6.89345 34.6206 7.50518L37.4232 22.3265C37.6223 23.3802 38.1344 24.3495 38.8926 25.1078C39.6509 25.866 40.6202 26.3781 41.6739 26.5772L56.4952 29.3798C57.107 29.4941 57.6594 29.8187 58.057 30.2974C58.4546 30.7762 58.6723 31.3789 58.6723 32.0012C58.6723 32.6235 58.4546 33.2262 58.057 33.7049C57.6594 34.1836 57.107 34.5083 56.4952 34.6225L41.6739 37.4252C40.6202 37.6242 39.6509 38.1363 38.8926 38.8946C38.1344 39.6529 37.6223 40.6221 37.4232 41.6758L34.6206 56.4972C34.5063 57.1089 34.1817 57.6614 33.703 58.059C33.2242 58.4566 32.6215 58.6742 31.9992 58.6742C31.3769 58.6742 30.7742 58.4566 30.2955 58.059C29.8168 57.6614 29.4922 57.1089 29.3779 56.4972L26.5752 41.6758C26.3762 40.6221 25.8641 39.6529 25.1058 38.8946C24.3475 38.1363 23.3783 37.6242 22.3246 37.4252L7.50322 34.6225C6.8915 34.5083 6.339 34.1836 5.94141 33.7049C5.54381 33.2262 5.32617 32.6235 5.32617 32.0012C5.32617 31.3789 5.54381 30.7762 5.94141 30.2974C6.339 29.8187 6.8915 29.4941 7.50322 29.3798L22.3246 26.5772C23.3783 26.3781 24.3475 25.866 25.1058 25.1078C25.8641 24.3495 26.3762 23.3802 26.5752 22.3265L29.3779 7.50518Z"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M53.333 5.33398V16.0007" stroke="#003CA6" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M58.6667 10.666H48" stroke="#003CA6" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M10.6663 58.6667C13.6119 58.6667 15.9997 56.2789 15.9997 53.3333C15.9997 50.3878 13.6119 48 10.6663 48C7.72082 48 5.33301 50.3878 5.33301 53.3333C5.33301 56.2789 7.72082 58.6667 10.6663 58.6667Z"
                        stroke="#003CA6"
                        strokeWidth="5.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    '✦'
                  )}
                </StepIcon>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepCard>
              {idx < content.steps.length - 1 ? (
                <Connector aria-hidden="true">
                  <svg width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0 37.3333L13.3333 18.6667L0 0H6.53333L19.8667 18.6667L6.53333 37.3333H0ZM15.8667 37.3333L29.2 18.6667L15.8667 0H22.4L35.7333 18.6667L22.4 37.3333H15.8667Z"
                      fill="#B4CFFF"
                    />
                  </svg>
                </Connector>
              ) : null}
            </StepWrap>
          ))}
        </StepsRow>
      </Inner>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  background: #eceff6;
  padding: 120px 0;
`;

const Inner = styled.div`
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  gap: 64px;

  ${mediaQueries.down.sm} {
    padding: 0 16px;
    gap: 40px;
  }
`;

const HeadingWrap = styled.div`
  width: min(909px, 100%);
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${colors.secondaryDark};
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize['6xl']};
  line-height: 140%;
  font-weight: ${typography.fontWeight.bold};
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  margin: 0;
  color: rgba(6, 21, 48, 0.8);
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
`;

const StepsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px;

  ${mediaQueries.down.xl} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${mediaQueries.down.sm} {
    grid-template-columns: 1fr;
  }
`;

const StepWrap = styled.div`
  position: relative;
`;

const StepCard = styled.div`
  min-height: 262px;
  border-radius: 24px;
  background: #f0f4ff;
  border: 1px solid rgba(0, 60, 166, 0.1);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
`;

const StepIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: ${colors.primary};
  font-size: 30px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepTitle = styled.h3`
  margin: 0;
  color: ${colors.secondaryDark};
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize.lg};
  line-height: 140%;
  font-weight: ${typography.fontWeight.bold};
`;

const StepDescription = styled.p`
  margin: 0;
  color: rgba(6, 21, 48, 0.7);
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  font-weight: ${typography.fontWeight.regular};
`;

const Connector = styled.div`
  position: absolute;
  right: -48px;
  top: 50%;
  transform: translateY(-50%);
  width: 64px;
  height: 64px;
  background: ${colors.white};
  border-radius: 72px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQueries.down.xl} {
    display: none;
  }
`;
