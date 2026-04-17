'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import { ForCreatorsBenefitPayload } from '@/lib/cms/types';

function IncomeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5v30M26.667 10H16.667C14.826 10 13.333 11.493 13.333 13.333s1.493 3.334 3.334 3.334h6.666c1.841 0 3.334 1.493 3.334 3.333S23.174 23.333 21.333 23.333H13.333" stroke="#003CA6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BrandIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 20a15 15 0 1 0 30 0A15 15 0 0 0 5 20zM15 10l10 10-10 10" stroke="#003CA6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ManagementIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5C11.716 5 5 11.716 5 20s6.716 15 15 15 15-6.716 15-15S28.284 5 20 5z" stroke="#003CA6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 13.333v8.334l5 5" stroke="#003CA6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="8.333" width="30" height="23.333" rx="3" stroke="#003CA6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.667 15l8.333 5-8.333 5V15z" stroke="#003CA6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function resolveBenefitIcon(id: ForCreatorsBenefitPayload['benefits'][number]['id']) {
  switch (id) {
    case 'income':
      return <IncomeIcon />;
    case 'brand':
      return <BrandIcon />;
    case 'management':
      return <ManagementIcon />;
    case 'content':
      return <ContentIcon />;
    default:
      return <IncomeIcon />;
  }
}

export function BenefitSection({ content }: { content: ForCreatorsBenefitPayload }) {
  return (
    <SectionContainer id="benefit">
      <Inner>
        <TopRow>
          <HeadingGroup>
            <SectionTitle>{content.section_title}</SectionTitle>
            <SectionDesc>{content.section_description}</SectionDesc>
          </HeadingGroup>
          <ContactButton href={content.contact_cta_url}>{content.contact_cta_label}</ContactButton>
        </TopRow>

        <BenefitGrid>
          {content.benefits.map((item, idx) => [
            <BenefitItem key={item.id}>
              <IconBox>{resolveBenefitIcon(item.id)}</IconBox>
              <BenefitText>
                <BenefitTitle>{item.title}</BenefitTitle>
                <BenefitDesc>{item.description}</BenefitDesc>
              </BenefitText>
            </BenefitItem>,
            idx < content.benefits.length - 1 && <Divider key={`sep-${item.id}`} />,
          ])}
        </BenefitGrid>
      </Inner>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  background: ${colors.white};
  padding: 80px 0;

  ${mediaQueries.down.lg} {
    padding: 60px 0;
  }

  ${mediaQueries.down.sm} {
    padding: 48px 0;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1281px;
  margin: 0 auto;
  padding: 0 84px;
  display: flex;
  flex-direction: column;
  gap: 64px;

  ${mediaQueries.down.lg} {
    padding: 0 ${spacing.xl};
    gap: 48px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 ${spacing.lg};
    gap: 40px;
  }
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 80px;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.xl};
  }
`;

const HeadingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['6xl']};
  line-height: 140%;
  text-transform: uppercase;
  color: ${colors.secondaryDark};
  margin: 0;

  ${mediaQueries.down.lg} {
    font-size: 32px;
  }

  ${mediaQueries.down.sm} {
    font-size: 26px;
  }
`;

const SectionDesc = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 150%;
  color: ${colors.secondaryDark};
  margin: 0;
`;

const ContactButton = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  height: 54px;
  border: 1px solid ${colors.secondaryDark};
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 48px;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.secondaryDark};

  &:hover {
    background: rgba(6, 21, 48, 0.05);
    transform: translateY(-2px);
  }
`;

const BenefitGrid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 40px;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.xl};
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 320px;
  background: ${colors.secondaryDark};
  opacity: 0.2;
  flex-shrink: 0;

  ${mediaQueries.down.lg} {
    display: none;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 56px;
  flex: 1;
  min-width: 0;

  ${mediaQueries.down.lg} {
    gap: ${spacing.xl};
    width: 100%;
  }
`;

const IconBox = styled.div`
  width: 96px;
  height: 96px;
  background: rgba(180, 207, 255, 0.6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform ${motion.duration.base} ease;

  ${BenefitItem}:hover & {
    transform: translateY(-4px);
  }
`;

const BenefitText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BenefitTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.secondaryDark};
  margin: 0;
`;

const BenefitDesc = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 150%;
  color: ${colors.secondaryDark};
  margin: 0;
`;
