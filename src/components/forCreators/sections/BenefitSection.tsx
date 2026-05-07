'use client';

import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import { ForCreatorsBenefitPayload } from '@/lib/cms/types';

function renderBenefitIcon(item: ForCreatorsBenefitPayload['benefits'][number]) {
  return (
    <CmsIconImage
      src={item.icon_image}
      alt={item.icon_image_alt || item.title}
      width={40}
      height={40}
    />
  );
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
          {content.benefits.map((item, idx) => (
            <BenefitItem key={item.id} $hasDivider={idx > 0}>
              <IconBox>{renderBenefitIcon(item)}</IconBox>
              <BenefitText>
                <BenefitTitle>{item.title}</BenefitTitle>
                <BenefitDesc>{item.description}</BenefitDesc>
              </BenefitText>
            </BenefitItem>
          ))}
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  column-gap: 48px;

  ${mediaQueries.down.lg} {
    grid-template-columns: 1fr;
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
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  ${mediaQueries.down.lg} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: ${spacing.xl};
  }

  ${mediaQueries.down.sm} {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div<{ $hasDivider: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  min-width: 0;
  padding: 0 40px;
  border-left: ${({ $hasDivider }) => ($hasDivider ? `1px solid ${colors.secondaryDark}` : 'none')};
  border-left-color: rgba(6, 21, 48, 0.2);

  ${mediaQueries.down.lg} {
    gap: ${spacing.xl};
    width: 100%;
    padding: 0 24px;
  }

  ${mediaQueries.down.sm} {
    border-left: none;
    border-top: ${({ $hasDivider }) => ($hasDivider ? `1px solid rgba(6, 21, 48, 0.2)` : 'none')};
    padding: 24px 0 0;
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

const CmsIconImage = styled(Image)`
  width: 40px;
  height: 40px;
  object-fit: contain;
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
