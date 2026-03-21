'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

export function ExclusiveTalentsSectionV2() {
  const talents = [
    "PUPU HOEHOE", "Phương Kin", "Phúc Nhân", "Kiều Lan", "Phương ..."
  ];

  return (
    <SectionContainer>
      <Title>Talents độc quyền</Title>
      
      <MainTalentArea>
        <TalentInfoContent>
          <TalentNameBlock>
            <TalentName>Nguyệt Busi</TalentName>
            <TalentHandle>@nguyetbusine</TalentHandle>
          </TalentNameBlock>
          
          <StatsBlock>
            <Stat>
              <StatValue>3.5M+</StatValue>
              <StatLabel>Followers</StatLabel>
            </Stat>
            <Stat>
              <StatValue>71.2M+</StatValue>
              <StatLabel>Likes</StatLabel>
            </Stat>
          </StatsBlock>

          <TalentDescription>
            3Brothers Media đồng hành & hỗ trợ định hướng cá nhân phù hợp mang đậm dấu ấn cá nhân giúp nâng tầm vị thế của Talent trong lĩnh vực giải trí.
          </TalentDescription>
          
          <ReadMore>Xem thêm</ReadMore>
        </TalentInfoContent>
        
        <TalentPhotoMain />
      </MainTalentArea>
      
      <BottomSlidersArea>
        <VerticalText>50+ TALENTS</VerticalText>
        <SliderTrack>
          <ThumbnailsRow>
            {talents.map((t, idx) => (
              <TalentThumb key={idx}>
                <ThumbName>{t}</ThumbName>
              </TalentThumb>
            ))}
          </ThumbnailsRow>
          <CustomScrollbar />
        </SliderTrack>
      </BottomSlidersArea>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  background: ${colors.bgDark};
  border-radius: 120px 120px 0 0;
  padding: 120px ${spacing['5xl']};
  display: flex;
  flex-direction: column;
  gap: ${spacing['5xl']};
  color: ${colors.white};
  margin-top: 40px;

  ${mediaQueries.down.sm} {
    padding: 60px ${spacing.lg};
    gap: ${spacing['2xl']};
    border-radius: 60px 60px 0 0;
  }
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 120%;
  text-transform: uppercase;
  margin: ${spacing[0]};
  text-align: left;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['5xl']};
  }
`;

const MainTalentArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: ${spacing['2xl']};
  width: 100%;

  ${mediaQueries.down.lg} {
    flex-direction: column;
  }
`;

const TalentInfoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${spacing.xl};
`;

const TalentNameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const TalentName = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['8xl']};
  margin: ${spacing[0]};
  background: linear-gradient(90deg, ${colors.white} 0%, ${colors.brandLightBlueDark} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['4xl']};
  }
`;

const TalentHandle = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.xl};
  color: ${colors.primaryLight};
`;

const StatsBlock = styled.div`
  display: flex;
  gap: ${spacing.xl};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const StatValue = styled.div`
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['4xl']};
  color: ${colors.white};
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: ${typography.fontSize.md};
  color: #AEC2F2;
`;

const TalentDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 160%;
  color: #D1DBE8;
  max-width: 500px;
  margin: ${spacing[0]};
`;

const ReadMore = styled.a`
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.md};
  color: ${colors.white};
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    color: #AEC2F2;
  }
`;

const TalentPhotoMain = styled.div`
  flex: 1;
  height: 600px;
  background: linear-gradient(180deg, #51496D, #302A41);
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize['2xl']};
  color: rgba(255,255,255,0.5);
  border: 4px solid rgba(255,255,255,0.1);

  ${mediaQueries.down.lg} {
    height: 400px;
  }

  &::after {
    content: "Nguyệt Busi Photo Placeholder";
    font-family: 'Inter', sans-serif;
  }
`;

const BottomSlidersArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing['2xl']};
  width: 100%;
  margin-top: ${spacing['2xl']};

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const VerticalText = styled.div`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['2xl']};
  color: ${colors.white};
  letter-spacing: 4px;
  opacity: 0.8;
  height: 200px;
  text-align: center;

  ${mediaQueries.down.sm} {
    writing-mode: horizontal-tb;
    transform: none;
    height: auto;
    letter-spacing: 2px;
  }
`;

const SliderTrack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  flex: 1;
  width: 100%;
`;

const ThumbnailsRow = styled.div`
  display: flex;
  gap: ${spacing.lg};
  overflow-x: auto;
  /* hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TalentThumb = styled.div`
  min-width: 200px;
  height: 260px;
  background: #1A2845;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${spacing.md};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform ${motion.duration.base};

  &:hover {
    transform: translateY(-8px);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%);
  }
`;

const ThumbName = styled.div`
  position: relative;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.lg};
  color: ${colors.white};
  z-index: 1;
`;

const CustomScrollbar = styled.div`
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 20%; /* simulates scroll position */
    background: ${colors.white};
    border-radius: 2px;
  }
`;
