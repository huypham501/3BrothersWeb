'use client';

import { useState } from "react";
import styled, { css } from "styled-components";
import { Container } from "@/components/primitives/Container";
import { mq } from "@/styles/mediaQueries";

const OFFER_ITEMS = ["OPTIMIZE", "Promotion", "MANAGE", "CONSULT", "Payment"] as const;

const EXTRA_OFFERS = [
  {
    title: "Brand Partnership",
    iconSrc: "/metub/template/images/icons/extra-offter-1.svg",
    iconWidth: 36,
    iconHeight: 33,
  },
  {
    title: "Copyright Protection",
    iconSrc: "/metub/template/images/icons/extra-offter-2.svg",
    iconWidth: 30,
    iconHeight: 38,
  },
  {
    title: "Media Solutions",
    iconSrc: "/metub/template/images/icons/extra-offter-3.svg",
    iconWidth: 47,
    iconHeight: 40,
  },
  {
    title: "Merchandise",
    iconSrc: "/metub/template/images/icons/extra-offter-4.svg",
    iconWidth: 38,
    iconHeight: 28,
  },
  {
    title: "Functional Studio",
    iconSrc: "/metub/template/images/icons/extra-offter-5.svg",
    iconWidth: 34,
    iconHeight: 32,
  },
  {
    title: "Music & Soundtrack Library",
    iconSrc: "/metub/template/images/icons/extra-offter-6.svg",
    iconWidth: 38,
    iconHeight: 38,
  },
] as const;

export function ForCreatorsOfferSection() {
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  return (
    <OfferSection>
      <Container>
        <Heading>
          <HeadingTitle>
            Create. earn. live <span>by passion</span>
          </HeadingTitle>
        </Heading>

        <WeOffer>
          <WeOfferGrid>
            <WeOfferTitle>We Offer</WeOfferTitle>
            <OfferList aria-label="We Offer">
              {OFFER_ITEMS.map((label, index) => (
                <OfferItem key={label}>
                  <OfferButton
                    type="button"
                    $active={activeOfferIndex === index}
                    aria-pressed={activeOfferIndex === index}
                    onClick={() => setActiveOfferIndex(index)}
                  >
                    {label}
                  </OfferButton>
                </OfferItem>
              ))}
            </OfferList>
          </WeOfferGrid>
        </WeOffer>

        <ExtraOffer>
          <ExtraOfferTitle>Extra Offer</ExtraOfferTitle>
          <ExtraOfferGrid>
            {EXTRA_OFFERS.map((offer) => (
              <ExtraOfferCard key={offer.title}>
                <ExtraOfferIcon
                  src={offer.iconSrc}
                  width={offer.iconWidth}
                  height={offer.iconHeight}
                  alt={offer.title}
                  loading="lazy"
                  decoding="async"
                />
                <ExtraOfferText>{offer.title}</ExtraOfferText>
              </ExtraOfferCard>
            ))}
          </ExtraOfferGrid>
        </ExtraOffer>
      </Container>
    </OfferSection>
  );
}


const OfferSection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]} 0;
  background-color: ${({ theme }) => theme.colors.white};

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing["5xl"]} 0;
  }
`;

const Heading = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
`;

const HeadingTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  }
`;

const WeOffer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["4xl"]};
`;

const WeOfferGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  ${mq.md} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing["3xl"]};
  }
`;

const WeOfferTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const OfferList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: ${({ theme }) => theme.spacing.md};

  ${mq.md} {
    justify-content: flex-end;
  }
`;

const OfferItem = styled.li``;

const OfferButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: transparent;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition:
    background-color ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeInOut},
    color ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeInOut};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${({ theme }) => theme.colors.bgLight};
      color: ${({ theme }) => theme.colors.primary};
    `}
`;

const ExtraOffer = styled.div``;

const ExtraOfferTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ExtraOfferGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  ${mq.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ExtraOfferCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
`;

const ExtraOfferIcon = styled.img`
  flex: 0 0 auto;
`;

const ExtraOfferText = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
