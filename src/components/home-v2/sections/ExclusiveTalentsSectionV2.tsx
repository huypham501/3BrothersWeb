'use client';

import styled from 'styled-components';

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
  background: #031027; /* Dark blue background */
  border-radius: 120px 120px 0 0;
  padding: 120px 80px;
  display: flex;
  flex-direction: column;
  gap: 80px;
  color: #FFFFFF;
  margin-top: 40px; /* Overlaps slightly with section above if necessary, or just margin */
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 68px;
  line-height: 120%;
  text-transform: uppercase;
  margin: 0;
  text-align: left;
`;

const MainTalentArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 40px;
  width: 100%;
`;

const TalentInfoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
`;

const TalentNameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TalentName = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 56px;
  margin: 0;
  background: linear-gradient(90deg, #FFFFFF 0%, #AEC2F2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TalentHandle = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: #6395ED;
`;

const StatsBlock = styled.div`
  display: flex;
  gap: 32px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.div`
  font-weight: 700;
  font-size: 32px;
  color: #FFFFFF;
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #AEC2F2;
`;

const TalentDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 160%;
  color: #D1DBE8;
  max-width: 500px;
  margin: 0;
`;

const ReadMore = styled.a`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #FFFFFF;
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
  font-size: 24px;
  color: rgba(255,255,255,0.5);
  border: 4px solid rgba(255,255,255,0.1);

  &::after {
    content: "Nguyệt Busi Photo Placeholder";
    font-family: 'Inter', sans-serif;
  }
`;

const BottomSlidersArea = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  width: 100%;
  margin-top: 40px;
`;

const VerticalText = styled.div`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #FFFFFF;
  letter-spacing: 4px;
  opacity: 0.8;
  height: 200px;
  text-align: center;
`;

const SliderTrack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const ThumbnailsRow = styled.div`
  display: flex;
  gap: 24px;
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
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

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
  font-weight: 700;
  font-size: 18px;
  color: #FFFFFF;
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
    background: #FFFFFF;
    border-radius: 2px;
  }
`;
