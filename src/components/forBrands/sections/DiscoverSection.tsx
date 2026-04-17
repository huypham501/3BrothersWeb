'use client';

import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { mq } from "@/styles/mediaQueries";

const DISCOVER_ITEMS = [
  {
    title: "Right Platform",
    iconSrc: "/metub/template/images/upload/power.svg",
    iconWidth: 39,
    iconHeight: 42,
    alt: "Right Platform",
    description: (
      <>
        We aim for your success.
        <br />
        We have powerful tool to follow, assess, and optimize to deliver results with outstanding
        and measurable impact.
      </>
    ),
  },
  {
    title: "Right People",
    iconSrc: "/metub/template/images/upload/partner.svg",
    iconWidth: 39,
    iconHeight: 42,
    alt: "Right People",
    description: (
      <>
        We have a vast network of influencers and content creators.
        <br />
        We can match a perfect partner for your brand and create your authentic influencer
        marketing campaign.
      </>
    ),
  },
  {
    title: "Right Time",
    iconSrc: "/metub/template/images/upload/proper.svg",
    iconWidth: 39,
    iconHeight: 42,
    alt: "Right Time",
    description: (
      <>
        We provide tailor-made campaigns.
        <br />
        We develop proper strategies, excecution, with in-depth reports to fulfill your every
        need.
      </>
    ),
  },
  {
    title: "Authentic",
    iconSrc: "/metub/template/images/upload/trophy.svg",
    iconWidth: 39,
    iconHeight: 42,
    alt: "Authentic",
    description: (
      <>
        We are the foremost authority in the influencer marketing industry.
        <br />
        We&apos;ve created inspiring campaigns with market-topping brands.
      </>
    ),
  },
] as const;

export function DiscoverSection() {
  return (
    <DiscoverSection>
      <Container>
        <Heading>
          <HeadingTitle>
            DISCOVER <br />
            <span>OUR INFLUENCER CONNECT COMPASS</span>
          </HeadingTitle>
        </Heading>

        <DiscoverGrid>
          {DISCOVER_ITEMS.map((item) => (
            <DiscoverCard key={item.title}>
              <DiscoverIconWrap>
                <DiscoverIcon
                  src={item.iconSrc}
                  width={item.iconWidth}
                  height={item.iconHeight}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
              </DiscoverIconWrap>
              <DiscoverText>
                <DiscoverTitle>{item.title}</DiscoverTitle>
                <DiscoverDescription>{item.description}</DiscoverDescription>
              </DiscoverText>
            </DiscoverCard>
          ))}
        </DiscoverGrid>
      </Container>
    </DiscoverSection>
  );
}


const DiscoverSection = styled.section`
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

const DiscoverGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  ${mq.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing["3xl"]};
  }
`;

const DiscoverCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const DiscoverIconWrap = styled.div`
  flex: 0 0 auto;
  width: ${({ theme }) => theme.spacing["4xl"]};
  height: ${({ theme }) => theme.spacing["4xl"]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.bgLightAlt};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DiscoverIcon = styled.img`
  display: block;
`;

const DiscoverText = styled.div``;

const DiscoverTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DiscoverDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.textBody};
`;
