'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

import { HomePartnersPayload } from '@/lib/cms/types';

export function PartnersSectionV2({ content }: { content: HomePartnersPayload }) {
  const partners = content.partners || [];

  return (
    <PartnersContainer>
      <LogosWrapper>
        {partners.map((partner, index) => (
          partner.logo_image ? (
            <img 
              key={index} 
              src={partner.logo_image} 
              alt={partner.name} 
              style={{ maxHeight: '40px', maxWidth: '120px', objectFit: 'contain' }}
            />
          ) : (
            <LogoTextPlaceholder key={index}>
              {partner.name}
            </LogoTextPlaceholder>
          )
        ))}
      </LogosWrapper>
    </PartnersContainer>
  );
}

const PartnersContainer = styled.section`
  width: 100%;
  height: 120px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 60px; /* offset the margin */
  z-index: 1; 

  ${mediaQueries.down.sm} {
    height: 80px;
  }
`;

const LogosWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 63px;
  max-width: 1363px;
  width: 100%;
  padding: 0 ${spacing['2xl']};
  justify-content: space-between;
  opacity: 0.8;

  ${mediaQueries.down.lg} {
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const LogoTextPlaceholder = styled.div`
  color: ${colors.white};
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.xl};
  text-transform: uppercase;
  letter-spacing: 1px;
`;
