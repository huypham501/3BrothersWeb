'use client';

import styled, { keyframes } from "styled-components";
import { Container } from "@/components/primitives/Container";
import { mq, mqMotion } from "@/styles/mediaQueries";

const TOP_TICKER_ITEMS = [
  { label: "INFLUENCER MARKETING", iconSrc: "/metub/template/images/icons/youtube_influencer.svg" },
  { label: "CONTENT PARTNERSHIP", iconSrc: "/metub/template/images/icons/24_music_light.svg" },
  { label: "SPONSORSHIP", iconSrc: "/metub/template/images/icons/24_instagram_light.svg" },
  { label: "DISTRIBUTION", iconSrc: "/metub/template/images/icons/24_NCT_light.svg" },
] as const;

const BOTTOM_TICKER_ITEMS = [
  { label: "PETS", iconSrc: "/metub/template/images/icons/pets.svg" },
  { label: "TRAVEL", iconSrc: "/metub/template/images/icons/travel.svg" },
  { label: "ENTERTAINMENT", iconSrc: "/metub/template/images/icons/entertainment.svg" },
  { label: "LIFESTYLE", iconSrc: "/metub/template/images/icons/lifestyle.svg" },
  { label: "BEAUTY", iconSrc: "/metub/template/images/icons/beauty.svg" },
  { label: "GAMING", iconSrc: "/metub/template/images/icons/gaming.svg" },
  { label: "SPORT", iconSrc: "/metub/template/images/icons/sport.svg" },
  { label: "AND MORE" },
] as const;

export function ForBrandsInformationSection() {
  return (
    <InformationSection aria-label="For Brands information">
      <TickerRow items={TOP_TICKER_ITEMS} />

      <InformationInner>
        <Container>
          <InformationText>
            <InformationTitle>REACH THE DIGITAL FIRST AUDIENCE</InformationTitle>
            <InformationDescription>
              With engaging, innovative and unique contents, we are the know-how to connect your
              brand with digital audiences of all platforms through data insights.
            </InformationDescription>
          </InformationText>
        </Container>
      </InformationInner>

      <TickerRow items={BOTTOM_TICKER_ITEMS} />
    </InformationSection>
  );
}

type TickerItem = {
  label: string;
  iconSrc?: string;
};

function TickerRow({ items }: { items: readonly TickerItem[] }) {
  const looped = [...items, ...items];

  return (
    <TickerWrap>
      <TickerTrack>
        {looped.map((item, index) => (
          <TickerItem key={`${item.label}-${index}`}>
            <TickerLabel>{item.label}</TickerLabel>
            {item.iconSrc ? <TickerIcon src={item.iconSrc} alt="" aria-hidden="true" /> : null}
          </TickerItem>
        ))}
      </TickerTrack>
    </TickerWrap>
  );
}

const tickerScroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

const InformationSection = styled.section`
  background-color: ${({ theme }) => theme.colors.bgDark};
`;

const TickerWrap = styled.div`
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`;

const TickerTrack = styled.div`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  gap: ${({ theme }) => theme.spacing["3xl"]};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  animation: ${tickerScroll} 26s linear infinite;
  will-change: transform;

  ${mqMotion.reduce} {
    animation: none;
    transform: none;
  }
`;

const TickerItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.white};
`;

const TickerLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const TickerIcon = styled.img`
  width: ${({ theme }) => theme.spacing.lg};
  height: ${({ theme }) => theme.spacing.lg};
`;

const InformationInner = styled.div`
  background-image: url(/metub/template/images/bg/bg-infomation-1.png);
  background-position: center;
  background-size: cover;
  padding: ${({ theme }) => theme.spacing["5xl"]} 0;

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing["6xl"]} 0;
  }
`;

const InformationText = styled.div`
  max-width: ${({ theme }) => theme.containerWidths.md};
  margin: 0 auto;
  text-align: center;
`;

const InformationTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  }
`;

const InformationDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.white};
`;
