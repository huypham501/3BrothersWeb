'use client';

import styled from 'styled-components';

export function HeroSectionV2() {
  return (
    <HeroContainer>
      <GlowEffect />
      <ContentWrapper>
        <TextBlock>
          <Title>Đồng hành để<br/>cùng thành<br/>công</Title>
          <SubText>
            3Brothers Media cung cấp giải pháp phù hợp và hiệu quả cho nhãn hàng dựa trên sự thấu hiểu - tôn trọng màu sắc Talent.
          </SubText>
          <ButtonGroup>
            <PrimaryButton href="#">
              Liên hệ tư vấn
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </PrimaryButton>
            <SecondaryButton href="#">Xem portfolio</SecondaryButton>
          </ButtonGroup>
        </TextBlock>
        <ImagePlaceholder />
      </ContentWrapper>
    </HeroContainer>
  );
}

const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  height: 800px; /* From CSS */
  background: linear-gradient(0deg, #031027, #031027), linear-gradient(180deg, #6395ED 0%, #003CA6 100%);
  border-radius: 0px 0px 120px 120px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 80px;
  color: #FFFFFF;
`;

const GlowEffect = styled.div`
  position: absolute;
  width: 1064px;
  height: 585px;
  left: -30px;
  top: 406px;
  background: #003CA6;
  filter: blur(50px);
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 60px; /* to offset the header */
`;

const TextBlock = styled.div`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 68px;
  line-height: 120%;
  text-transform: uppercase;
  margin: 0;
`;

const SubText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  margin: 0;
  opacity: 0.9;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const PrimaryButton = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px 24px;
  gap: 8px;
  background: #FFFFFF;
  border-radius: 24px;
  color: #003CA6;
  text-decoration: none;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const SecondaryButton = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px 24px;
  gap: 8px;
  background: transparent;
  border: 1px solid #FFFFFF;
  border-radius: 24px;
  color: #FFFFFF;
  text-decoration: none;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ImagePlaceholder = styled.div`
  width: 480px;
  height: 560px;
  background: linear-gradient(180deg, #A48B8B, #4C3C3C); /* approximate color for the placeholder */
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;

  &::after {
    content: "L'Oreal Paris Image Placeholder";
    color: rgba(255,255,255,0.7);
    font-weight: bold;
    font-family: 'Inter', sans-serif;
    text-align: center;
    padding: 20px;
  }
`;
