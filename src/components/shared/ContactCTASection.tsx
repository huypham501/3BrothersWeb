import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

import { SharedContactCtaPayload } from '@/lib/cms/types';

const DEFAULT_CONTACT_CTA_CONTENT: SharedContactCtaPayload = {
  title: 'GET IN TOUCH',
  subtitle: '',
  cta_label: 'Contact us',
  cta_url: '/',
};
const CONTACT_CTA_BG_IMAGE = '/images/home/contact-cta-bg.png';
const CONTACT_CTA_BG_ASPECT_RATIO = '2880 / 1843';
const CONTACT_CTA_BG_WIDTH = '1440px';

interface ContactCTASectionProps {
  content?: SharedContactCtaPayload | null;
}

export function ContactCTASection({ content }: ContactCTASectionProps) {
  const resolvedContent = content ?? DEFAULT_CONTACT_CTA_CONTENT;

  return (
    <SectionContainer>
      <ContentBlock>
        <Title dangerouslySetInnerHTML={{ __html: resolvedContent.title.replace(/\n/g, '<br />') }} />
        <Subtitle>
          {resolvedContent.subtitle}
        </Subtitle>
        <ButtonWrapper>
          <ContactButton href={resolvedContent.cta_url || '#'}>
            {resolvedContent.cta_label}
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
  width: 100%;
  padding: 120px ${spacing['5xl']};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  background: ${colors.primaryLight};

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
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    pointer-events: none;
    z-index: 0;
  }

  ${mediaQueries.down.sm} {
    padding: 80px ${spacing.lg};
    &::before { background-position: center -40px; }
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
