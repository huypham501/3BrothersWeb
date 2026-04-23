'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

import { SharedContactCtaPayload } from '@/lib/cms/types';

const DEFAULT_CONTACT_CTA_CONTENT: SharedContactCtaPayload = {
  title: 'GET IN TOUCH',
  subtitle: '',
  cta_label: 'Contact us',
  cta_url: '/',
};

export function ContactCTASectionV2({ content = DEFAULT_CONTACT_CTA_CONTENT }: { content?: SharedContactCtaPayload }) {
  return (
    <SectionContainer>
      <BackgroundEffectsLayer src="/images/home/contact-cta-bg-from-group.svg" alt="" aria-hidden="true" />

      <ContentBlock>
        <Title dangerouslySetInnerHTML={{ __html: content.title.replace(/\n/g, '<br />') }} />
        <Subtitle>
          {content.subtitle}
        </Subtitle>
        <ButtonWrapper>
          <ContactButton href={content.cta_url || '#'}>
            {content.cta_label}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </ContactButton>
        </ButtonWrapper>
      </ContentBlock>
    </SectionContainer>
  );
}

/* ─── Styled Components ─────────────────────────────────────────── */

const SectionContainer = styled.section`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-height: 800px;
  padding: 150px ${spacing['5xl']} 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  overflow: hidden;
  background: ${colors.primaryLight};

  ${mediaQueries.down.sm} {
    min-height: auto;
    padding: 80px ${spacing.lg};
    justify-content: center;
  }
`;

const BackgroundEffectsLayer = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  width: 1440px;
  height: 800px;
  transform: translateX(-50%);
  display: block;
  pointer-events: none;
  z-index: 0;

  ${mediaQueries.down.md} {
    inset: 0;
    width: 100%;
    height: 100%;
    left: 0;
    transform: none;
    object-fit: cover;
    object-position: center top;
  }

  ${mediaQueries.down.sm} {
    object-position: center -40px;
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

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 120%;
  text-transform: uppercase;
  text-align: center;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 48px;
  }

  ${mediaQueries.down.sm} {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
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
  filter: drop-shadow(0px 0px 12px rgba(6, 21, 48, 0.6));
`;

const ContactButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  background: ${colors.white};
  border-radius: 48px;
  color: #061530;
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  white-space: nowrap;
  transition: opacity ${motion.duration.base};

  &:hover {
    opacity: 0.85;
  }
`;
