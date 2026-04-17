'use client';

import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { Col, Row } from "@/components/primitives/Grid";
import { mq } from "@/styles/mediaQueries";

type OurBrand = {
  key: string;
  name: string;
  websiteUrl: string;
  logoSrc: string;
  heroImageSrc: string;
  about: readonly string[];
  whatWeDo: readonly string[];
  ourWork?: readonly string[];
};

const BRANDS: readonly OurBrand[] = [
  {
    key: "mmusic",
    name: "M.MUSIC",
    websiteUrl: "http://mmusic.asia",
    logoSrc: "/metub/template/images/upload/brands/logo-brand-2.png",
    heroImageSrc: "/metub/template/images/upload/brands/brand-2.png",
    about: [
      "MMusic is the Record Label for GenZ artists in Vietnam. Our desire is to create a new music playground that is full of opportunities for young dynamic artists and their music products to go beyond borders.",
      "We incline towards carving out a niche for Vietnamese music on the world map, as well as building a bridge between International Artists and Vietnamese audiences.",
      "Our strongest suit is that we are a hybrid between a Distributor and a Label. With our dedication to the generation Z, we are open to collaborations of any kind to create a platform that provide the best for artists.",
      "#2M4S represents MMusic, Sol, Soul, Stream and Show. At MMusic, we want artists to preserve their original music, which deeply represents their soul. And MMusic is here to help them create a business by maximizing their streams and shows opportunities.",
      "MMusic is established as “Tailor-made for GenZ’s Music'', believing that artists will be able to live by passion as “real artists”, and the rest will be \"tailor-made\" supporting by us.",
    ],
    whatWeDo: [
      "MMusic aims to build, develop and create a playground for young artists to debut, flourish and achieve outstanding milestones on their musical journey, as well as maximize the value of music products.",
      "We want to create a trendy, dynamic and effective music community space for the generation Z audiences on all platforms, plus connecting GenZ artists and enhancing audiences’ music experience.",
    ],
    ourWork: [
      "Music Distribution: We distribute artists' products to DSPs and promote it in the fan community. Hence, their products get more streaming traffic, climb up charts and generate royalty.",
      "Collaboration: We create music collaborations opportunities, including but not limited to collaborations between Music Producers, or between International Artists and Local Artists.",
      "Business Development: We execute branded contents, produce merchandise and represent artists and their company in international label deals.",
      "Fanbase Building: We help artists grow their fan communities through shows, talk shows, visualized shows, and media sponsorships, helping artists connect with their fans.",
      "Management Supports: We provide Quarterly revenue reports, Data-driven insights, Music marketing plan, Content ID protection, Editorial Playlists and Stream & Performance optimization.",
    ],
  },
  {
    key: "mgn",
    name: "MGN.",
    websiteUrl: "https://mgn.vn",
    logoSrc: "/metub/template/images/upload/brands/logo-brand-3.png",
    heroImageSrc: "/metub/template/images/upload/brands/brand-3.png",
    about: [
      "Through various social media platforms that we are building. We at MGN position ourselves as a company focusing in the gaming and eSports communities.",
      "MGN serves as a bridge connecting brands and gaming communities that share the same value.",
      "MGN wants to spread a positive and progressive image of gaming communities, which are continuously contributing meritorious value to society.",
    ],
    whatWeDo: [
      "The leading website for Gaming & Esports News in Vietnam",
      "Providing the newest and the most exciting information to gamers",
      "Specializing in games and everything related to gaming entertainment",
      "Keeping up with the latest trends in GenZ and gamer lifestyle.",
    ],
    ourWork: [
      "Website: The leading website for Gaming & Esports News in Vietnam",
      "YouTube Channel: Providing the newest and the most exciting information to gamers",
      "Facebook: Specializing in games and everything related to gaming entertainment",
      "TikTok: Keeping up with the latest trends in GenZ and gamer lifestyle.",
      "400 STREAMERS/YOUTUBERS IN MGN COMMUNITY",
      "A gaming content network with the biggest top-creators in Vietnam and SEA.",
    ],
  },
  {
    key: "joyme",
    name: "JOYME",
    websiteUrl: "https://joyme.io",
    logoSrc: "/metub/template/images/upload/brands/logo-brand-4.png",
    heroImageSrc: "/metub/template/images/upload/brands/brand-4.png",
    about: [
      "Joyme is one of the first free-of-charge bio link platforms that provides users a place to share all the contents they want with no limits for content creators.",
    ],
    whatWeDo: [
      "A link for all your links: Everything in one link. Your social media, messenger buttons, photos, video, and even music. Add as many links and socials as you like.",
      "Personalize your own profile: 100% customizable. Make your own profile pop. Make it your style.",
      "Super easy to use: No computers, designers, or developers needed. Ready in a matter of seconds with just your phone.",
    ],
    ourWork: [
      "Affiliate Marketing support",
      "Super trendy theme set, especially with interchange format",
      "+50 Vietnamized fonts",
      "More than 8000 users after 3 months of launch prominently such as Elite artist Xuan Bac, MC Tran Thanh, and other hot TikTokers.",
    ],
  },
  {
    key: "melive",
    name: "MELIVE",
    websiteUrl: "https://www.melive.network",
    logoSrc: "/metub/template/images/upload/brands/logo-brand-7.png",
    heroImageSrc: "/metub/template/images/upload/brands/brand-7.jpg",
    about: [
      "MELIVE - MẮT THẤY TAY MUA",
      "The connection and training network of KOLs/KOCs via a leading livestream channel in Vietnam.",
    ],
    whatWeDo: [
      "Building and developing a network to connect influencers to the purchasing habits of consumers on social networking platforms (i.e. facebook, instagram, tiktok...) and on e-commerce websites.",
      "Leading, training and supporting KOLs/KOCs to become professional sales livestreamers, aiming to generate long-term passive revenue.",
      "Melive plays an instrumental role of connecting brands with KOLs/KOCs to bring the brands closer to consumers.",
    ],
    ourWork: [
      "Tạp hoá 3 cô — Online store by BB Tran - Hai Trieu - Ngoc Phuoc, selling fashion and accessories for the youth.",
      "Haylie Hằng Trần — Online fashion store specializing in pants, dynamic sporty style for women.",
      "Melive Fashion — Elegant women's office online fashion store.",
      "Melive Creator Network — Networking, consulting and content management for KOCs on social networking platforms.",
    ],
  },
  {
    key: "monox",
    name: "MONO X",
    websiteUrl: "https://monox.asia/",
    logoSrc: "/metub/template/images/upload/brands/logo-brand-6.png",
    heroImageSrc: "/metub/template/images/upload/brands/brand-6.png",
    about: ["Xplode the X factor"],
    whatWeDo: ["FEVER - K-ICM FT. WREN EVANS", "FASHION3 - WREN EVANS x DEC.AO", "FASHION NOVA - WREN EVANS"],
  },
] as const;

export function BrandsSection() {
  return (
    <Section>
      <Container>
        <BrandList>
          {BRANDS.map((brand) => (
            <BrandItem key={brand.key}>
              <Row>
                <Col $spanMd={5} $spanLg={4}>
                  <BrandLeft>
                    <BrandLogoWrap>
                      <BrandLogo src={brand.logoSrc} width={96} height={96} alt={brand.name} loading="lazy" />
                    </BrandLogoWrap>
                    <BrandName>
                      <a href={brand.websiteUrl} rel="nofollow noreferrer" target="_blank">
                        {brand.name}
                      </a>
                    </BrandName>
                    <BrandText>
                      {brand.about.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </BrandText>
                    <VisitSite>
                      <a href={brand.websiteUrl} rel="nofollow noreferrer" target="_blank">
                        Visit website
                      </a>
                    </VisitSite>
                  </BrandLeft>
                </Col>

                <Col $spanMd={7} $spanLg={8}>
                  <BrandRight>
                    <BrandHeroImageWrap>
                      <BrandHeroImage
                        src={brand.heroImageSrc}
                        width={800}
                        height={342}
                        alt={brand.name}
                        loading="lazy"
                      />
                    </BrandHeroImageWrap>

                    <Row>
                      <Col $spanLg={brand.ourWork ? 6 : 12}>
                        <BrandSubTitle>What we do</BrandSubTitle>
                        <BrandText>
                          {brand.whatWeDo.map((p) => (
                            <p key={p}>{p}</p>
                          ))}
                        </BrandText>
                      </Col>

                      {brand.ourWork ? (
                        <Col $spanLg={6}>
                          <BrandSubTitle>Our Work</BrandSubTitle>
                          <BrandText>
                            {brand.ourWork.map((p) => (
                              <p key={p}>{p}</p>
                            ))}
                          </BrandText>
                        </Col>
                      ) : null}
                    </Row>
                  </BrandRight>
                </Col>
              </Row>
            </BrandItem>
          ))}
        </BrandList>
      </Container>
    </Section>
  );
}


const Section = styled.section`
  padding: ${({ theme }) => theme.spacing["3xl"]} 0 ${({ theme }) => theme.spacing["5xl"]};

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing["4xl"]} 0 ${({ theme }) => theme.spacing["6xl"]};
  }
`;

const BrandList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing["4xl"]};
`;

const BrandItem = styled.article`
  padding-top: ${({ theme }) => theme.spacing["3xl"]};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};

  ${mq.md} {
    padding-top: ${({ theme }) => theme.spacing["4xl"]};
  }
`;

const BrandLeft = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing["3xl"]};

  ${mq.md} {
    padding-bottom: 0;
  }
`;

const BrandLogoWrap = styled.div`
  width: ${({ theme }) => theme.spacing["6xl"]};
  height: ${({ theme }) => theme.spacing["6xl"]};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BrandLogo = styled.img`
  width: ${({ theme }) => theme.spacing["6xl"]};
  height: ${({ theme }) => theme.spacing["6xl"]};
  object-fit: contain;
`;

const BrandName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.textPrimary};

  a {
    color: inherit;
  }
`;

const BrandSubTitle = styled.h4`
  margin: ${({ theme }) => theme.spacing["2xl"]} 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BrandText = styled.div`
  color: ${({ theme }) => theme.colors.textBody};

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const VisitSite = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }
`;

const BrandRight = styled.div``;

const BrandHeroImageWrap = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bgLightAlt};
`;

const BrandHeroImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;
