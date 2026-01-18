'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Container } from '@/components/primitives/Container';
import { H2 } from '@/components/ui/Heading';
import { Card, CardImg, CardBody, CardTitle, CardMeta, CardText } from '@/components/shared/Card';
import { SwiperControls, SwiperButtonPrev, SwiperButtonNext } from '@/components/shared/Swiper';
import { Section } from '@/components/primitives/Section';
import styled from 'styled-components';
import { mq } from '@/styles/mediaQueries';
import { breakpoints, spacing } from '@/styles/tokens';

import 'swiper/css';
import 'swiper/css/navigation';

const SWIPER_BREAKPOINT_SM = parseInt(breakpoints.sm, 10);
const SWIPER_BREAKPOINT_LG = parseInt(breakpoints.lg, 10);
const SWIPER_SPACE_XL = parseInt(spacing.xl, 10);

const StyledTrendingSection = styled(Section)`
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  
  ${mq.lg} {
    margin-top: ${({ theme }) => theme.spacing['5xl']};
  }
`;

const Heading = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  ${mq.md} {
    margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  }
  
  h2 {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    
    img {
      vertical-align: middle;
    }
  }
`;

const TrendingSwiper = styled.div`
  position: relative;
  
  .swiper {
    overflow: visible;
  }
`;

// Sample trending data
const trendingPosts = [
  {
    id: 1341,
    slug: '3brothers-nhung-con-so-an-tuong-cua-nam-2024',
    title: '3Brothers - những con số ấn tượng của năm 2024',
    image: 'https://media.3brothers.net/resize_x384x288/thumb/2025/02/03/yt11_02_02_000000.jpg',
    category: 'Biz News',
    date: 'Feb 03,2025',
    excerpt: '3Brothers - những con số ấn tượng của năm 2024'
  },
  {
    id: 1339,
    slug: 'hoa-hau-thuy-tien-tung-trailer-du-dem-mua-3-fan-ran-ran-voi-dan-anh-trai-khach-moi',
    title: 'Hoa hậu Thuỳ Tiên tung trailer "Đu Đêm" mùa 3, fan rần rần với dàn Anh Trai khách mời',
    image: 'https://media.3brothers.net/resize_x384x288/thumb/2025/01/21/f61584f2fcaf43f11abe16_09_57_000000.jpg',
    category: 'Biz News',
    date: 'Jan 21,2025',
    excerpt: 'Dàn Anh Trai visual đỉnh cỡ nào, rap hay ra sao qua tay "Đu Đêm" của Thùy Tiên cũng thành người gác tàu, người bán vàng mã, người khắc dưa kiếm cơm.'
  },
  {
    id: 1337,
    slug: 'chien-dich-tet-den-roi-tetmetit-co-hoi-100-tang-tuong-tac-cung-3brothers-network',
    title: 'Chiến dịch Tết Đến Rồi #TếtMêTít -  Cơ hội 100% tăng tương tác cùng 3Brothers Network',
    image: 'https://media.3brothers.net/resize_x384x288/thumb/2025/01/06/thumb_blog_metub__511_41_59_000000.png',
    category: 'Wassupyoutube',
    date: 'Jan 06,2025',
    excerpt: 'Chiến dịch Tết Đến Rồi #TếtMêTít -  Cơ hội 100% tăng tương tác cùng 3Brothers Network'
  },
  {
    id: 1334,
    slug: 'workshop-youtube-tet-2025-giai-ma-so-lieu-but-pha-noi-dung',
    title: 'Workshop: YouTube Tết 2025 - Giải Mã Số Liệu, Bứt Phá Nội Dung',
    image: 'https://media.3brothers.net/resize_x384x288/thumb/2024/12/30/thumb_blog_metub__316_47_40_000000.png',
    category: 'Wassupyoutube',
    date: 'Dec 30,2024',
    excerpt: 'YouTube Shopping Tết 2025: cơ hội vàng để tạo nên những nội dung sáng tạo và gần gũi, kết nối sâu sắc với khán giả và tối ưu tiềm năng doanh thu.'
  },
  {
    id: 1333,
    slug: 'nang-tam-sang-tao-voi-cac-cap-nhat-tu-youtube-shopping',
    title: 'Nâng Tầm Sáng Tạo Với Các Cập Nhật Từ Youtube Shopping',
    image: 'https://media.3brothers.net/resize_x384x288/thumb/2024/12/23/thumb_blog_metub__215_03_21_000000.png',
    category: 'Wassupyoutube',
    date: 'Dec 23,2024',
    excerpt: 'Nâng Tầm Sáng Tạo Với Các Cập Nhật Từ Youtube Shopping'
  }
];

export function TrendingSection() {
  return (
    <StyledTrendingSection>
      <Container>
        <Heading>
          <H2 $variant="title-2" style={{ textTransform: 'uppercase' }}>
            WHAT TRENDING<br/>
            <span>NOW ?</span>{' '}
            <img src="/metub/template/images/icons/hot.png" width="56" height="56" alt="WHAT TRENDING NOW ?" />
          </H2>
        </Heading>
        
        <TrendingSwiper className="trending custom-arrows">
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            navigation={{
              prevEl: '.swiper-button-prev-trending',
              nextEl: '.swiper-button-next-trending',
            }}
            breakpoints={{
              [SWIPER_BREAKPOINT_SM]: {
                slidesPerView: 2,
                spaceBetween: SWIPER_SPACE_XL,
              },
              [SWIPER_BREAKPOINT_LG]: {
                slidesPerView: 3,
                spaceBetween: SWIPER_SPACE_XL,
              }
            }}
          >
            {trendingPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <Card>
                  <CardImg>
                    <a href={`/blog/${post.slug}-${post.id}.html`}>
                      <Image
                        src={post.image}
                        width={384}
                        height={288}
                        alt={post.title}
                        style={{ width: '100%', height: 'auto' }}
                        loading="lazy"
                      />
                    </a>
                  </CardImg>
                  <CardBody>
                    <CardTitle>
                      <a href={`/blog/${post.slug}-${post.id}.html`}>
                        {post.title}
                      </a>
                    </CardTitle>
                    <CardMeta>
                      <span className="in-category" style={{ textTransform: 'uppercase' }}>{post.category}</span>
                      <span className="timer" style={{ textTransform: 'uppercase' }}>{post.date}</span>
                    </CardMeta>
                    <CardText>
                      {post.excerpt}
                    </CardText>
                  </CardBody>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <SwiperControls $variant="default">
            <SwiperButtonNext className="swiper-button-next-trending swiper-next" />
            <SwiperButtonPrev className="swiper-button-prev-trending swiper-prev" />
          </SwiperControls>
        </TrendingSwiper>
      </Container>
    </StyledTrendingSection>
  );
}
