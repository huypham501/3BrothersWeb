'use client';

import Link from "next/link";
import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { mq } from "@/styles/mediaQueries";

const SOCIAL_ICONS = [
  { src: "/metub/template/images/icons/24_facebook_light.svg", top: "12%", left: "18%" },
  { src: "/metub/template/images/icons/24_instagram_light.svg", top: "6%", left: "55%" },
  { src: "/metub/template/images/icons/24_youtube_light.svg", top: "20%", left: "80%" },
  { src: "/metub/template/images/icons/24_tik_tok_light.svg", top: "52%", left: "88%" },
  { src: "/metub/template/images/icons/24_music_light.svg", top: "82%", left: "70%" },
  { src: "/metub/template/images/icons/24_apple_music_light.svg", top: "86%", left: "35%" },
  { src: "/metub/template/images/icons/24_NCT_light.svg", top: "72%", left: "8%" },
  { src: "/metub/template/images/icons/24_music_light.svg", top: "44%", left: "4%" },
] as const;

export function ForCreatorsGrowSection() {
  return (
    <GrowSection>
      <Container>
        <GrowGrid>
          <GrowText>
            <GrowTitle>
              Grow YOUR COMMUNITIY
              <br />
              MAXIMIZE YOUR OPPORTUNITY
            </GrowTitle>
            <GrowDescription>
              We bring multi platform network data-driven insights and technology application to
              your creativity and help plan your content distribution, create your own
              merchandise and bring your creative to life
            </GrowDescription>
            <ProgramLink href="/get-in-touch.html">
              CREATOR PROGRAM <span aria-hidden="true">→</span>
            </ProgramLink>
          </GrowText>

          <GrowVisual aria-hidden="true">
            <SocialsAnimation>
              {SOCIAL_ICONS.map((icon) => (
                <SocialIconCircle key={`${icon.src}-${icon.top}-${icon.left}`} $top={icon.top} $left={icon.left}>
                  <SocialIcon src={icon.src} alt="" loading="lazy" decoding="async" />
                </SocialIconCircle>
              ))}
              <CenterLogo
                src="/metub/template/images/3brothers-logo-white.png"
                width={91}
                height={23}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </SocialsAnimation>
          </GrowVisual>
        </GrowGrid>
      </Container>
    </GrowSection>
  );
}


const GrowSection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]} 0;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.bgDark};
  background-image: url(/metub/template/images/bg/bg-creator-grow.png);
  background-position: center;
  background-size: cover;

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing["5xl"]} 0;
  }

  ${mq.lg} {
    padding: ${({ theme }) => theme.spacing["6xl"]} 0;
  }
`;

const GrowGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing["3xl"]};

  ${mq.md} {
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.spacing["4xl"]};
  }
`;

const GrowText = styled.div`
  flex: 1;
`;

const GrowTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  }
`;

const GrowDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  max-width: 46ch;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.white};
`;

const ProgramLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    line-height: ${({ theme }) => theme.typography.lineHeight.none};
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const GrowVisual = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const SocialsAnimation = styled.div`
  position: relative;
  width: 100%;
  max-width: ${({ theme }) => theme.containerWidths.sm};
  aspect-ratio: 1;
`;

const SocialIconCircle = styled.div<{ $top: string; $left: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  transform: translate(-50%, -50%);

  width: ${({ theme }) => theme.spacing[5]};
  height: ${({ theme }) => theme.spacing[5]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;

  ${mq.md} {
    width: ${({ theme }) => theme.spacing["4xl"]};
    height: ${({ theme }) => theme.spacing["4xl"]};
  }
`;

const SocialIcon = styled.img`
  width: ${({ theme }) => theme.spacing.lg};
  height: ${({ theme }) => theme.spacing.lg};
`;

const CenterLogo = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
