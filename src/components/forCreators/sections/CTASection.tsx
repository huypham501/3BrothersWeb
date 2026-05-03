'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import { ForCreatorsCtaPayload } from '@/lib/cms/types';

const CONTACT_CTA_BG_IMAGE = '/images/home/contact-cta-bg.png';
const CONTACT_CTA_BG_ASPECT_RATIO = '2880 / 1843';
const CONTACT_CTA_BG_WIDTH = '1440px';

export function CTASection({ content }: { content: ForCreatorsCtaPayload }) {
  return (
    <SectionContainer>
      <ContentBlock>
        <Heading dangerouslySetInnerHTML={{ __html: content.heading.replace(/\n/g, '<br />') }} />
        <Subtitle>{content.subtitle}</Subtitle>
        <ButtonWrapper>
          <JoinButton href={content.cta_url}>
            {content.cta_label}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833"
                stroke="#061530"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </JoinButton>
        </ButtonWrapper>
      </ContentBlock>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  padding: 120px ${spacing['5xl']};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${CONTACT_CTA_BG_WIDTH};
    height: auto;
    aspect-ratio: ${CONTACT_CTA_BG_ASPECT_RATIO};
    transform: translateX(-50%);
    background-image: url('${CONTACT_CTA_BG_IMAGE}');
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% auto;
    -webkit-mask-image:
      linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%),
      linear-gradient(to bottom, transparent 0%, black 12%, black 100%);
    mask-image:
      linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%),
      linear-gradient(to bottom, transparent 0%, black 12%, black 100%);
    -webkit-mask-repeat: no-repeat, no-repeat;
    mask-repeat: no-repeat, no-repeat;
    -webkit-mask-size: 100% 100%, 100% 100%;
    mask-size: 100% 100%, 100% 100%;
    -webkit-mask-composite: source-in;
    mask-composite: intersect;
    pointer-events: none;
    z-index: 0;
  }

  ${mediaQueries.down.sm} {
    padding: 80px ${spacing.lg};

    &::before {
      background-position: center -40px;
    }
  }
`;

const ContentBlock = styled.div`
  position: relative;
  z-index: 10;
  max-width: 957px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  ${mediaQueries.down.sm} {
    gap: ${spacing.xl};
  }
`;

const Heading = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 56px;
  line-height: 120%;
  text-transform: uppercase;
  text-align: center;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 40px;
  }

  ${mediaQueries.down.sm} {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  text-align: center;
  color: ${colors.white};
  margin: 0;
  max-width: 909px;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize.base};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0px 0px 12px rgba(6, 21, 48, 0.6));
`;

const JoinButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  height: 54px;
  background: ${colors.white};
  border-radius: 48px;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity ${motion.duration.base};

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: 140%;
  color: ${colors.secondaryDark};

  &:hover {
    opacity: 0.85;
  }
`;
