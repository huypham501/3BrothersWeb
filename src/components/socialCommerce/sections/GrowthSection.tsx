'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

// ── Data ──────────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { title: '5 Dịch vụ', desc: 'Tạo nguồn thu nhập đa dạng hơn' },
  { title: '5,000+ Creators & KOLs', desc: 'Tham gia cộng tác cùng mạng lưới 3Brothers' },
  { title: '150+ Brands', desc: 'Trở thành đối tác nền tảng' }
];

// ── Component ─────────────────────────────────────────────────────────────────

export function GrowthSection() {
  return (
    <SectionContainer>
      {/* Background overlapping gradient mesh (Vectors 5, 6, 7, 8, 9, 3) representing the background blobs */}
      <BackgroundMesh>
        <MeshMask>
          <GradientBase />
          <Blob1 />
          <Blob2 />
          <Blob3 />
          <Blob4 />
          <Blob5 />
          <Blob6 />
        </MeshMask>
      </BackgroundMesh>

      <Inner>
        {/* Left Column: Title and CTA */}
        <LeftContent>
          <MainHeading>
            NHIỀU CƠ HỘI HƠN,<br />THU NHẬP CAO HƠN
          </MainHeading>
          
          <Description>
            Nhờ vào mạng lưới Creator Economy, chúng tôi cung cấp đa dạng dịch vụ Social Commerce 
            giúp Creator & KOL chủ động tạo ra thu nhập và mở ra các cơ hội monetization mới.
          </Description>

          <CtaButton href="#">
            <CtaText>Bắt đầu ngay</CtaText>
            <ArrowIcon>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="#061530" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ArrowIcon>
          </CtaButton>
        </LeftContent>

        {/* Right Column: Cards */}
        <RightContent>
          {STAT_CARDS.map((card, idx) => (
            <StatCard key={idx}>
              <CardIcon />
              <CardContent>
                <CardTitle>{card.title}</CardTitle>
                <CardDesc>{card.desc}</CardDesc>
              </CardContent>
            </StatCard>
          ))}
        </RightContent>
      </Inner>
    </SectionContainer>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 675px;
  background: #061530;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${mediaQueries.down.lg} {
    padding: 80px 0;
  }
`;

/* ── Background Mesh ── */
const BackgroundMesh = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

const MeshMask = styled.div`
  position: absolute;
  inset: 0;
  top: 5px;
  overflow: hidden;
`;

const GradientBase = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, #061530, #061530), linear-gradient(180deg, #6395ED 0%, #003CA6 100%);
`;

const Blob1 = styled.div`
  position: absolute;
  height: 1371px;
  width: 800px;
  left: -283px;
  top: -351px;
  background: #0859EA;
  filter: blur(50px);
  transform: matrix(0.95, -0.32, 0.17, 0.99, 0, 0);
`;

const Blob2 = styled.div`
  position: absolute;
  height: 1051px;
  width: 600px;
  right: -200px;
  top: -422px;
  background: #447EE2;
  filter: blur(50px);
  transform: matrix(-0.96, 0.3, 0.27, 0.96, 0, 0);
`;

const Blob3 = styled.div`
  position: absolute;
  height: 1016px;
  width: 600px;
  left: -252px;
  top: -51px;
  background: #2068E4;
  filter: blur(80px);
  transform: matrix(0.95, -0.32, 0.17, 0.99, 0, 0);
`;

const Blob4 = styled.div`
  position: absolute;
  height: 779px;
  width: 500px;
  right: -100px;
  top: -290px;
  background: #6395ED;
  filter: blur(80px);
  transform: matrix(-0.96, 0.3, 0.27, 0.96, 0, 0);
`;

const Blob5 = styled.div`
  position: absolute;
  height: 637px;
  width: 400px;
  left: -219px;
  top: 203px;
  background: #639CFF;
  filter: blur(50px);
  transform: matrix(0.95, -0.32, 0.17, 0.99, 0, 0);
`;

const Blob6 = styled.div`
  position: absolute;
  height: 488px;
  width: 400px;
  right: -200px;
  top: -150px;
  background: #E0DED6;
  filter: blur(50px);
  opacity: 0.5;
  transform: matrix(-0.96, 0.3, 0.27, 0.96, 0, 0);
`;

/* ── Inner Content ── */
const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 84px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 60px;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    padding: 0 40px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 20px;
  }
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 512px;
  gap: 32px;
`;

const MainHeading = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 32px;
  }
`;

const Description = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: ${colors.white};
  margin: 0;
`;

const CtaButton = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  height: 54px;
  background: #FFE773;
  border-radius: 48px;
  text-decoration: none;
  transition: transform ${motion.duration.base} ease, opacity ${motion.duration.base} ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
  }
`;

const CtaText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: 140%;
  display: flex;
  align-items: center;
  color: #061530;
`;

const ArrowIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ── Right Content ── */
const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 624px;
`;

const StatCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  gap: 24px;
  width: 100%;
  min-height: 136px;
  background: rgba(180, 207, 255, 0.2);
  border-radius: 44px;
  transition: transform ${motion.duration.base} ease;

  &:hover {
    transform: translateX(-4px);
  }

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: flex-start;
    border-radius: 24px;
  }
`;

const CardIcon = styled.div`
  width: 96px;
  height: 96px;
  background: rgba(180, 207, 255, 0.2);
  border-radius: 24px;
  flex-shrink: 0;

  ${mediaQueries.down.sm} {
    width: 64px;
    height: 64px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
`;

const CardTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: #FFE773;
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 20px;
  }
`;

const CardDesc = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: ${colors.white};
  margin: 0;
`;
