'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import type { SharedContactCtaPayload } from '@/lib/cms/types';

const CONTACT_CTA_BG_IMAGE = '/images/home/contact-cta-bg.png';
const CONTACT_CTA_BG_ASPECT_RATIO = '2880 / 1843';
const CONTACT_CTA_BG_WIDTH = '1440px';

interface ContactCTASectionViewProps {
  content: SharedContactCtaPayload;
}

export function ContactCTASectionView({ content }: ContactCTASectionViewProps) {
  return (
    <SectionContainer>
      <BackgroundLayer aria-hidden="true" />
      <ContentBlock>
        <Title dangerouslySetInnerHTML={{ __html: content.title.replace(/\n/g, '<br />') }} />
        <Subtitle>{content.subtitle}</Subtitle>
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

  ${mediaQueries.down.sm} {
    padding: 80px ${spacing.lg};
  }
`;

const BackgroundLayer = styled.div`
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

  ${mediaQueries.down.sm} {
    background-position: center -40px;
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
  font-family: ${typography.fontFamily.montserrat};
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
  font-family: ${typography.fontFamily.montserrat};
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
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  white-space: nowrap;
  transition: opacity ${motion.duration.base};

  &:hover {
    opacity: 0.85;
  }
`;
