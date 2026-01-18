'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import styled from 'styled-components';
import { Container, H2, H3, Row, Col, Link } from '@/components';
import { mq } from '@/styles/mediaQueries';
import { breakpoints, spacing } from '@/styles/tokens';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const SWIPER_BREAKPOINT_SM = parseInt(breakpoints.sm, 10);
const SWIPER_BREAKPOINT_MD = parseInt(breakpoints.md, 10);
const SWIPER_BREAKPOINT_LG = parseInt(breakpoints.lg, 10);

const SWIPER_SPACE_SM = parseInt(spacing['2xl'], 10);
const SWIPER_SPACE_MD = parseInt(spacing['2xl'], 10);
const SWIPER_SPACE_LG = parseInt(spacing['4xl'], 10);

const StyledPassionCrewSection = styled.section`
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  background: ${({ theme }) => theme.colors.bgDark};

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing['4xl']} 0;
  }

  ${mq.lg} {
    padding: ${({ theme }) => theme.spacing['5xl']} 0;
  }
`;

const Heading = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};

  ${mq.md} {
    margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  }

  ${mq.lg} {
    margin-bottom: ${({ theme }) => theme.spacing['4xl']};
  }
`;

const CrewSlider = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};

  .swiper {
    overflow: visible;
  }

  .swiper-pagination {
    position: relative;
    margin-top: ${({ theme }) => theme.spacing['2xl']};
  }
`;

const CrewItemWrap = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  ${mq.md} {
    margin-bottom: 0;
  }
`;

const CrewItemImg = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  aspect-ratio: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut};
  }

  &:hover {
    img {
      opacity: 0;
    }
  }
`;

const CrewItemImgBefore = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CrewItemEllipse = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.secondaryDark};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.3;
  }
`;

const CrewItemText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CrewTitle = styled(H3)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CrewMeta = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    color: ${({ theme }) => theme.colors.textSecondary};

    span {
      color: ${({ theme }) => theme.colors.primary};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    }
  }
`;

const CrewExpert = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.textSecondary};

  p {
    margin: 0;
  }
`;

const ViewMore = styled.div``;

const CrewThumbs = styled.div`
  .swiper {
    position: relative;
  }
`;

const ThumbSlide = styled.div`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  transition: transform ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut};

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
`;

// Data for crew members
const crewMembers = [
  {
    name: 'TRAN THANH TOWN',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/Tr___n_Th__nh_Town11_05_48_000000.jpeg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/Tr___n_Th__nh_Town11_05_48_000000.jpeg',
    followers: '5.5M',
    views: '1.3B',
    expert: 'Tran Thanh is a famous comedian, actor who has starred in many famous movies such as "Cua lại vợ bầu", "Trạng Quỳnh". Especially, he is well-known for his MC role in many TV shows, reality shows like: "Người Bí Ẩn", "Nhanh như chớp nhí".',
    link: 'https://www.youtube.com/channel/UCqL0-EknCK4m5pHrH79fOcw'
  },
  {
    name: 'HAU HOANG',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/h___u_ho__ng11_26_19_000000.jpg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/h___u_ho__ng11_26_19_000000.jpg',
    followers: '7.7M',
    views: '2.8B',
    expert: 'Hoang Thuy Hau ( Hau Hoang) is a YouTuber, dancer and Parody Creator. Her YouTube channel has more than 7.48 million subscribers and 2.6 billion video views.',
    link: 'https://www.youtube.com/channel/UCbIZSalhHyz3RNWj2wowzdQ'
  },
  {
    name: 'MIXIGAMING',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/Untitled_Capture2244_211_39_43_000000.jpg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/Untitled_Capture2244_211_39_43_000000.jpg',
    followers: '6.3M',
    views: '2.2B',
    expert: 'Known by the streamer name Do Mixi, Phung Thanh Do is one of the most prominent streamers in Vietnam. He is loved by the audience for his straightforwardness, outgoing and fun personality.',
    link: 'https://www.youtube.com/channel/UCA_23dkEYToAc37hjSsCnXA'
  },
  {
    name: 'FABO NGUYEN',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/FABO_NGUY___N11_53_16_000000.jpeg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/FABO_NGUY___N11_53_16_000000.jpeg',
    followers: '802K',
    views: '91.5M',
    expert: 'Fabo Nguyen is considered one of the most prominent "rich kids" in the hypebeast community in Vietnam. He owns a Youtube channel, sharing his lifestyle, unboxing luxurious items, especially rare and expensive Sneakers.',
    link: 'https://www.youtube.com/channel/UCCuoXy-TcFWSlqCwbU-TQcg'
  },
  {
    name: 'DINOLOGY',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/DINOLOGY11_54_22_000000.jpeg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/DINOLOGY11_54_22_000000.jpeg',
    followers: '431K',
    views: '71.8M',
    expert: 'From a young man who never cooked, Dino Vu has become a famous Vietnamese food blogger. He graduated from University of Economics and went to Saigon to start his own career with his first job as Marketing Executive. Then he quit his job and pursued a passion for cooking with his YouTube channel.',
    link: 'https://www.youtube.com/channel/UCwTi_xn6ukH9QJsNtH-oNWw'
  },
  {
    name: 'GIA DINH CAM CAM',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/gia_____nh_cam_cam_213_48_15_000000.jpg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/gia_____nh_cam_cam_213_48_15_000000.jpg',
    followers: '996K',
    views: '175.6M',
    expert: 'Gia Dinh Cam Cam is a family YouTube channel, run by Cam Cam and his wife. They share their daily life and family moments on YouTube, attracting millions of subscribers.',
    link: 'https://www.youtube.com/channel/UCkQN7Bq4wD_R2BqXvF3kTUA'
  },
  {
    name: 'HUYNH LAP',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/HU___NH_L___P13_42_56_000000.jpg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/HU___NH_L___P13_42_56_000000.jpg',
    followers: '1.2M',
    views: '245M',
    expert: 'Huynh Lap is a famous comedian and theater director in Vietnam. He is known for his unique comedy style and has created many successful comedy shows.',
    link: 'https://www.youtube.com/channel/UCcQN7Bq4wD_R2BqXvF3kTUA'
  },
  {
    name: 'Ly Hai Production',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/L___H___i13_56_10_000000.jpeg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/L___H___i13_56_10_000000.jpeg',
    followers: '2.1M',
    views: '890M',
    expert: 'Ly Hai is a famous Vietnamese singer, actor, and film director. He is known for his Lat Mat film series, which has been very successful in Vietnam.',
    link: 'https://www.youtube.com/channel/UCdQN7Bq4wD_R2BqXvF3kTUA'
  },
  {
    name: 'VIET PHUONG THOA',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/Vi___t_Ph____ng_Thoa14_00_39_000000.jpeg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/Vi___t_Ph____ng_Thoa14_00_39_000000.jpeg',
    followers: '1.5M',
    views: '320M',
    expert: 'Viet Phuong Thoa is a popular YouTuber known for her comedy skits and vlogs. She has gained a large following for her relatable and entertaining content.',
    link: 'https://www.youtube.com/channel/UCeQN7Bq4wD_R2BqXvF3kTUA'
  },
  {
    name: 'THU TRANG OFFICIAL',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/Thu_Trang_Official14_03_29_000000.jpeg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/Thu_Trang_Official14_03_29_000000.jpeg',
    followers: '1.8M',
    views: '450M',
    expert: 'Thu Trang is a Vietnamese actress and comedian, known for her roles in many Vietnamese films and comedy shows. She is also very active on YouTube.',
    link: 'https://www.youtube.com/channel/UCfQN7Bq4wD_R2BqXvF3kTUA'
  },
  {
    name: 'VIRUSS',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/Viruss14_06_20_000000.jpeg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/Viruss14_06_20_000000.jpeg',
    followers: '3.2M',
    views: '1.1B',
    expert: 'Viruss is a famous Vietnamese YouTuber and streamer, known for his gaming content and vlogs. He has a huge following and is one of the top creators in Vietnam.',
    link: 'https://www.youtube.com/channel/UCgQN7Bq4wD_R2BqXvF3kTUA'
  },
  {
    name: 'KHANH VY OFFICIAL',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/Khรกnh_Vy14_21_08_000000.jpeg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/Kh__nh_Vy14_21_08_000000.jpeg',
    followers: '1.1M',
    views: '180M',
    expert: 'Khanh Vy is a famous Vietnamese MC and YouTuber, known for her language skills and hosting various TV shows. She is very popular among young Vietnamese audiences.',
    link: 'https://www.youtube.com/channel/UChQN7Bq4wD_R2BqXvF3kTUA'
  },
  {
    name: 'CHAU BUI OFFICIAL',
    image: 'https://media.metub.net/resize_x384x384/partner/2022/06/14/Chau_Bui_0111_16_42_000000.jpg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2022/06/14/Chau_Bui_0111_16_42_000000.jpg',
    followers: '2.5M',
    views: '550M',
    expert: 'Chau Bui is a Vietnamese fashion influencer and model. She is known for her unique fashion sense and has become a prominent figure in the Vietnamese fashion industry.',
    link: 'https://www.youtube.com/channel/UCiQN7Bq4wD_R2BqXvF3kTUA'
  },
  {
    name: 'TLINH',
    image: 'https://media.metub.net/resize_x384x384/partner/2024/11/19/tlinh17_28_17_00000021_14_00_000000.jpg',
    thumb: 'https://media.metub.net/resize_x80x80/partner/2024/11/19/tlinh17_28_17_00000021_14_00_000000.jpg',
    followers: '890K',
    views: '120M',
    expert: 'A 2000-born rapper, singer, and dancer, Tlinh joined Suboi\'s team in "Rap Viet" Season 1. Her chart-topping hits are Thích Quá Rùi Nà, Tình Yêu Bận Bịu, Vứt Zác, etc. In August 2021, Tlinh\'s new single - Gai Doc Than, was included in the EQUAL Global playlist on Spotify, dedicated to women empowerment worldwide.',
    link: 'https://www.youtube.com/channel/UC3O-gNkOsgemkuhuAopEGbA'
  }
];

export function PassionCrewSection() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <StyledPassionCrewSection>
      <Container>
        <Heading>
          <H2 className="text-uppercase text-md-center">
            PASSION <span>CREW ON BOARD</span>
          </H2>
        </Heading>

        <CrewSlider>
          <Swiper
            modules={[Pagination, Thumbs]}
            spaceBetween={0}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            pagination={{
              type: 'progressbar',
            }}
          >
            {crewMembers.map((member, index) => (
              <SwiperSlide key={index}>
                <Row>
                  <Col $spanMd={5}>
                    <CrewItemWrap>
                      <CrewItemImg>
                        <Image
                          src={member.image}
                          width={384}
                          height={384}
                          alt={member.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                        <CrewItemImgBefore>
                          <Image
                            src={member.image}
                            width={384}
                            height={384}
                            alt={member.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                          />
                        </CrewItemImgBefore>
                      </CrewItemImg>
                      <CrewItemEllipse>
                        <img
                          src="/metub/template/images/icons/Line-Cretors-2.svg"
                          width="386"
                          height="287"
                          alt="Line Creators"
                          loading="lazy"
                        />
                      </CrewItemEllipse>
                    </CrewItemWrap>
                  </Col>
                  <Col $spanMd={7}>
                    <CrewItemText>
                      <CrewTitle className="text-uppercase">{member.name}</CrewTitle>
                      <CrewMeta>
                        <Row>
                          <Col $auto>
                            <p>
                              <span>{member.followers}</span> Followers
                            </p>
                            <p>
                              <span></span> Times
                            </p>
                          </Col>
                          <Col $auto>
                            <p>
                              <span>{member.views}</span> Views
                            </p>
                            <p>
                              <span></span> Streaming
                            </p>
                          </Col>
                        </Row>
                      </CrewMeta>
                      <CrewExpert>{member.expert}</CrewExpert>
                      <ViewMore>
                        <Link
                          href={member.link}
                          $variant="gradient"
                          className="text-uppercase"
                          target="_blank"
                          title={`Read more about ${member.name}`}
                        >
                          Read more about {member.name}
                        </Link>
                      </ViewMore>
                    </CrewItemText>
                  </Col>
                </Row>
              </SwiperSlide>
            ))}
          </Swiper>
        </CrewSlider>

        <CrewThumbs className="passion-crew-thumbs">
          <Swiper
            modules={[Navigation, Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={SWIPER_SPACE_SM}
            slidesPerView={2}
            freeMode={true}
            watchSlidesProgress={true}
            navigation={{
              prevEl: '.swiper-button-prev-passion',
              nextEl: '.swiper-button-next-passion',
            }}
            breakpoints={{
              [SWIPER_BREAKPOINT_SM]: {
                slidesPerView: 2,
                spaceBetween: SWIPER_SPACE_SM,
              },
              [SWIPER_BREAKPOINT_MD]: {
                slidesPerView: 5,
                spaceBetween: SWIPER_SPACE_MD,
              },
              [SWIPER_BREAKPOINT_LG]: {
                slidesPerView: 5,
                spaceBetween: SWIPER_SPACE_LG,
              },
            }}
          >
            {crewMembers.map((member, index) => (
              <SwiperSlide key={index}>
                <ThumbSlide>
                  <Image
                    src={member.thumb}
                    width={80}
                    height={80}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </ThumbSlide>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-next-passion swiper-next"></div>
          <div className="swiper-button-prev-passion swiper-prev"></div>
        </CrewThumbs>
      </Container>
    </StyledPassionCrewSection>
  );
}
