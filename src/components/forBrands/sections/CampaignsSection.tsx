'use client';

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { Col, Row } from "@/components/primitives/Grid";
import { SwiperButtonNext, SwiperButtonPrev, SwiperControls } from "@/components/shared/Swiper";
import { mq } from "@/styles/mediaQueries";
import { breakpoints, spacing } from "@/styles/tokens";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const CAMPAIGNS = [
  {
    title: "P/S ETB",
    image: "https://media.metub.net/resize_x384x384/partner/2022/06/14/4d9fd3843ba1a30cc6aceaa8eb6cace0c925e676_1080x108017_47_34_000000.png",
    thumb: "https://media.metub.net/resize_x80x80/partner/2022/06/14/4d9fd3843ba1a30cc6aceaa8eb6cace0c925e676_1080x108017_47_34_000000.png",
    intro: "P/S ETB",
    sections: [
      {
        heading: "Project background",
        text: 'P/S enters the electronic brush market with the P/S S100 Pro. Despite being a newbie, P/S S100 Pro offers a comprehensive list of features to become a hot trend item on the market, suitable to any trend seeker consumers: compact, modern design, robust and long-lasting battery. The last piece P/S needs is an effective marketing campaign to launch the product line to consumers.',
      },
      {
        heading: "Solution",
        text: "Metub tackled P/S’s challenges by offering an Influencers-driven campaign, the ideal solution to reach consumers with eye-catching posts and engaging content, and utilizing the Clickable Post format to direct consumers to their website. Additionally, the extensive review content posted on Facebook Groups & Dental Experts’ opinions has helped increase consumer trust and consideration for the product line. Therefore, the virality of the product line on social media has spanned months after the product launch.",
      },
      {
        heading: "Highlight",
        text: "Budget optimization via extending the usage of KOLs images each month to effectively continue promoting posts. The product launch campaign was a huge success & well-received by the consumer. Online orders on e-commerce sites were increasing.",
      },
    ],
  },
  {
    title: "UNILEVER (SIMPLE)",
    image: "https://media.metub.net/resize_x384x384/partner/2022/06/14/93644585_3299980526698344_2694962901587853312_n17_52_05_000000.png",
    thumb: "https://media.metub.net/resize_x80x80/partner/2022/06/14/93644585_3299980526698344_2694962901587853312_n17_52_05_000000.png",
    intro: "SIMPLE x CHAU BUI",
    sections: [
      {
        heading: "Project background",
        text: 'Simple is a new skincare brand launched in the Vietnam market. The first time to build brand awareness here, Simple wants to find a new approach through a strategy of taking advantage of the influence of voice, image, and the social network of "famous people."',
      },
      {
        heading: "Solution",
        text: "Through search, Metub successfully connected Chau Bui, one of the most influential young fashionistas in Vietnam and Asia, to become Simple's Brand Ambassador. This combination has brought many positive results for brand awareness and sales.",
      },
      {
        heading: "Outcome",
        text: "First, in Vietnam, the Simple x Shopee 11.11 campaign by Metub, in collaboration with Google and Mindshare Vietnam, is testing a parallel combination of Video Content Production and beta Youtube Creator Promotions. The video with Chau Bui's impressive appearance has reached more than 7 million viewers and recorded a high level of image recognition on Youtube, 110% effective compared to the cost of production and advertising.",
      },
    ],
  },
  {
    title: "TIKI (TIKI CONNECT)",
    image: "https://media.metub.net/resize_x384x384/partner/2022/06/14/Logo_0217_31_56_000000.png",
    thumb: "https://media.metub.net/resize_x80x80/partner/2022/06/14/Logo_0217_31_56_000000.png",
    intro: "INFLUENCER BOOKING AT SCALE WITH PERFORMANCE-DRIVEN TIKI",
    sections: [
      {
        heading: "Project background",
        text: "TIKI Connect is a media campaign through celebrities considered entirely new for TIKI in particular and other brands in general when paying KOL fees through practical activities on social networks such as video views and post interactions…",
      },
      {
        heading: "Solution",
        text: "TIKI Connect mainly spread on two platforms, Tiktok and Youtube. Metub plays the role of recommending, managing, and controlling KOLs as well as quality. Posted content. Some prominent faces were participating in the project, such as Fabo Nguyen, Chloe Nguyen, Tony TV, Hao Tho, Gam Kami, Tieu Man Thau, Pit Ham An, Gia Khiem, Bao An...",
      },
      {
        heading: "Outcome",
        text: "From December to December, the project has achieved more than 105 million views with 275 videos on Youtube and Tiktok Videos from KOL reached the top trending on YouTube.",
      },
    ],
  },
  {
    title: "LIFEBUOY",
    image: "https://media.metub.net/resize_x384x384/partner/2022/06/14/group_124318_02_55_000000.png",
    thumb: "https://media.metub.net/resize_x80x80/partner/2022/06/14/group_124318_02_55_000000.png",
    intro: "CONTENT DISTRIBUTION SERVICE LIFEBUOY TET MV DISTRIBUTION",
    sections: [
      {
        heading: "Project background",
        text: 'In New Year 2022, Lifebuoy continues the story of reminding everyone to keep clean. It integrates the message into the journey home after two years of the epidemic through the MV "Đường Về Nhà." The simple wishes expressed through each story and the lyrics in the MV "Đường Về Nhà" is also the message Lifebuoy wants to send to everyone during this year’s sweet season: Bringing "Phúc sạch khuẩn - Lộc sum vầy" to everyone, every home.',
      },
      {
        heading: "Solution",
        text: 'METUB is honored to contribute to spreading the meaningful message of "Tàu Về Nhà" to many people during this year’s season through the Youtube platform. YouTubers such as Thien An, H & M Channel, Lan Jee, and Di Di have enjoyed, shared widely, and spread positive emotions about the MV through their series of reaction videos.',
      },
      {
        heading: "Outcomes",
        bullets: [
          "10 million views after one week of release",
          "Top 10 BSI Leaderboard January 2022 (Buzzmetric report)",
          "MV with the most significant reaction watch-party on Youtube (3,700 views)",
        ],
      },
    ],
  },
] as const;

type CampaignSection =
  | {
      heading: string;
      text: string;
      bullets?: never;
    }
  | {
      heading: string;
      bullets: readonly string[];
      text?: never;
    };

type Campaign = {
  title: string;
  image: string;
  thumb: string;
  intro?: string;
  sections: readonly CampaignSection[];
};

const SWIPER_BREAKPOINT_SM = parseInt(breakpoints.sm, 10);
const SWIPER_BREAKPOINT_MD = parseInt(breakpoints.md, 10);
const SWIPER_BREAKPOINT_LG = parseInt(breakpoints.lg, 10);

const SWIPER_SPACE_MD = parseInt(spacing["2xl"], 10);
const SWIPER_SPACE_LG = parseInt(spacing["3xl"], 10);
const SWIPER_SPACE_XL = parseInt(spacing["4xl"], 10);

export function CampaignsSection() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <CampaignsSection aria-label="Campaigns">
      <Container>
        <Heading>
          <HeadingTitle>
            &quot;SPARK JOY&quot; <span>CAMPAIGNS</span>
          </HeadingTitle>
        </Heading>

        <CampaignsSlider>
          <Swiper
            modules={[Pagination, Thumbs]}
            spaceBetween={0}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            pagination={{
              type: "progressbar",
            }}
          >
            {(CAMPAIGNS as readonly Campaign[]).map((campaign) => (
              <SwiperSlide key={campaign.title}>
                <Row>
                  <Col $spanMd={5}>
                    <CampaignImageWrap>
                      <Image
                        src={campaign.image}
                        width={384}
                        height={384}
                        alt={campaign.title}
                        style={{ width: "100%", height: "auto" }}
                        loading="lazy"
                      />
                    </CampaignImageWrap>
                  </Col>
                  <Col $spanMd={7}>
                    <CampaignContent>
                      <CampaignTitle className="text-uppercase">{campaign.title}</CampaignTitle>
                      <CampaignBody>
                        {campaign.intro ? <p>{campaign.intro}</p> : null}
                        {campaign.sections.map((section) => (
                          <div key={section.heading}>
                            {"text" in section ? (
                              <p>
                                <strong>{section.heading}</strong>
                                <br />
                                {section.text}
                              </p>
                            ) : (
                              <p>
                                <strong>{section.heading}</strong>
                              </p>
                            )}
                            {"bullets" in section && section.bullets ? (
                              <CampaignBullets>
                                {(section.bullets as readonly string[]).map((bullet) => (
                                  <li key={bullet}>{bullet}</li>
                                ))}
                              </CampaignBullets>
                            ) : null}
                          </div>
                        ))}
                      </CampaignBody>
                    </CampaignContent>
                  </Col>
                </Row>
              </SwiperSlide>
            ))}
          </Swiper>
        </CampaignsSlider>

        <CampaignThumbs>
          <Swiper
            modules={[Navigation, Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={SWIPER_SPACE_MD}
            slidesPerView={2}
            freeMode={true}
            watchSlidesProgress={true}
            navigation={{
              prevEl: ".swiper-button-prev-brands-campaigns",
              nextEl: ".swiper-button-next-brands-campaigns",
            }}
            breakpoints={{
              [SWIPER_BREAKPOINT_SM]: { slidesPerView: 2, spaceBetween: SWIPER_SPACE_MD },
              [SWIPER_BREAKPOINT_MD]: { slidesPerView: 4, spaceBetween: SWIPER_SPACE_LG },
              [SWIPER_BREAKPOINT_LG]: { slidesPerView: 4, spaceBetween: SWIPER_SPACE_XL },
            }}
          >
            {(CAMPAIGNS as readonly Campaign[]).map((campaign) => (
              <SwiperSlide key={`${campaign.title}-thumb`}>
                <ThumbSlide>
                  <Image
                    src={campaign.thumb}
                    width={80}
                    height={80}
                    alt={campaign.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </ThumbSlide>
              </SwiperSlide>
            ))}
          </Swiper>

          <SwiperControls $variant="static">
            <SwiperButtonPrev className="swiper-button-prev-brands-campaigns swiper-prev" />
            <SwiperButtonNext className="swiper-button-next-brands-campaigns swiper-next" />
          </SwiperControls>
        </CampaignThumbs>
      </Container>
    </CampaignsSection>
  );
}


const CampaignsSection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]} 0;
  background-color: ${({ theme }) => theme.colors.white};

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing["5xl"]} 0;
  }

  .swiper-pagination-progressbar {
    position: relative;
    margin-top: ${({ theme }) => theme.spacing["2xl"]};
    background-color: ${({ theme }) => theme.colors.border};
  }

  .swiper-pagination-progressbar-fill {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Heading = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
  text-align: center;
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

const CampaignsSlider = styled.div`
  .swiper {
    overflow: visible;
  }
`;

const CampaignImageWrap = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bgLightAlt};
`;

const CampaignContent = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CampaignTitle = styled.h3`
  margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.textPrimary};

  ${mq.md} {
    margin-top: 0;
  }
`;

const CampaignBody = styled.div`
  color: ${({ theme }) => theme.colors.textBody};
  text-align: justify;

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const CampaignBullets = styled.ul`
  margin: ${({ theme }) => theme.spacing.xs} 0 ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.xl};

  li {
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    color: ${({ theme }) => theme.colors.textBody};
  }
`;

const CampaignThumbs = styled.div`
  margin-top: ${({ theme }) => theme.spacing["3xl"]};
`;

const ThumbSlide = styled.div`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  aspect-ratio: 1;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
