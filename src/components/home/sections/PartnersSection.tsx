'use client';

import styled, { css, keyframes } from 'styled-components';
import Image from 'next/image';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';

import { HomePartnersPayload } from '@/lib/cms/types';

export function PartnersSection({
  content,
  className,
  inComposite = false,
  isAnimated = true,
}: {
  content: HomePartnersPayload;
  className?: string;
  inComposite?: boolean;
  isAnimated?: boolean;
}) {
  const partners = content.partners || [];
  const shouldAnimate = isAnimated && partners.length >= 4;

  return (
    <PartnersContainer className={className} $inComposite={inComposite}>
      <Viewport>
        <Track data-marquee-track="true" $animate={shouldAnimate}>
          <PartnerSet $animate={shouldAnimate}>
            {partners.map((partner, index) => (
              <PartnerItem key={`partner-original-${index}`}>
                {partner.logo_image ? (
                  <PartnerLogo>
                    <Image
                      src={partner.logo_image}
                      alt={partner.name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </PartnerLogo>
                ) : (
                  <LogoTextPlaceholder>{partner.name}</LogoTextPlaceholder>
                )}
              </PartnerItem>
            ))}
          </PartnerSet>

          {shouldAnimate && (
            <PartnerSet aria-hidden="true" $animate={shouldAnimate}>
              {partners.map((partner, index) => (
                <PartnerItem key={`partner-clone-${index}`}>
                  {partner.logo_image ? (
                    <PartnerLogo>
                      <Image
                        src={partner.logo_image}
                        alt=""
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </PartnerLogo>
                  ) : (
                    <LogoTextPlaceholder>{partner.name}</LogoTextPlaceholder>
                  )}
                </PartnerItem>
              ))}
            </PartnerSet>
          )}
        </Track>
      </Viewport>
    </PartnersContainer>
  );
}

const PartnersContainer = styled.section<{ $inComposite: boolean }>`
  width: 100%;
  position: relative;
  min-height: ${({ $inComposite }) => ($inComposite ? '0' : '120px')};
  height: ${({ $inComposite }) => ($inComposite ? '100%' : 'auto')};
  background: ${({ $inComposite }) => ($inComposite ? 'transparent' : 'linear-gradient(180deg, #071E48 0%, #0b2a63 100%)')};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ $inComposite }) => ($inComposite ? '0' : `calc(${spacing.xl} + 96px) 0 ${spacing.xl}`)};

  &:hover [data-marquee-track='true'],
  &:focus-within [data-marquee-track='true'] {
    animation-play-state: paused;
  }

  ${mediaQueries.down.sm} {
    min-height: ${({ $inComposite }) => ($inComposite ? '0' : '80px')};
    padding: ${({ $inComposite }) => ($inComposite ? '0' : `calc(${spacing.lg} + 56px) 0 ${spacing.lg}`)};
  }
`;

const Viewport = styled.div`
  width: 100%;
  overflow: hidden;
`;

const marquee = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

const Track = styled.div<{ $animate: boolean }>`
  display: flex;
  align-items: center;
  width: ${({ $animate }) => ($animate ? 'max-content' : '100%')};
  animation: ${({ $animate }) => ($animate ? css`${marquee} 26s linear infinite` : 'none')};
  will-change: transform;

  ${mediaQueries.down.md} {
    animation-duration: ${({ $animate }) => ($animate ? '22s' : '0s')};
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
  }
`;

const PartnerSet = styled.div<{ $animate: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $animate }) => ($animate ? 'flex-start' : 'center')};
  gap: 63px;
  width: ${({ $animate }) => ($animate ? 'max-content' : '100%')};
  padding: 0 ${spacing['2xl']};
  opacity: 0.8;
  flex: none;

  ${mediaQueries.down.lg} {
    gap: 48px;
    padding: 0 ${spacing.xl};
  }
`;

const PartnerItem = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;

  ${mediaQueries.down.lg} {
    min-width: 96px;
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

const PartnerLogo = styled.div`
  position: relative;
  width: 120px;
  height: 40px;
  flex: none;

  ${mediaQueries.down.lg} {
    width: 96px;
    height: 32px;
  }
`;
