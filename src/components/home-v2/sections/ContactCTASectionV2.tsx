'use client';

import styled from 'styled-components';

export function ContactCTASectionV2() {
  return (
    <SectionContainer>
      <BeamsBackground />
      <ContentBlock>
        <Title>Đừng ngần ngại<br/>liên hệ</Title>
        <Subtitle>
          3Brothers Media với sứ mệnh trở thành cầu nối tin cậy giữa các nhãn hàng và các nhà sáng tạo nội dung (KOLs), chúng tôi cam kết mang lại những giá trị vượt trội, góp phần xây dựng thương hiệu mạnh mẽ và lan tỏa thông điệp hiệu quả.
        </Subtitle>
        <ContactButton href="#">
          Liên hệ ngay
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </ContactButton>
      </ContentBlock>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  padding: 160px 80px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;

  /* Simulating the light blue background with vertical beams/streaks */
  background: linear-gradient(180deg, #E0EBFF 0%, #D4E2FF 100%);
`;

const BeamsBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0px,
    rgba(255, 255, 255, 0) 80px,
    rgba(255, 255, 255, 0.4) 80px,
    rgba(255, 255, 255, 0.4) 82px
  );
`;

const ContentBlock = styled.div`
  z-index: 10;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 64px;
  line-height: 120%;
  text-transform: uppercase;
  color: #003CA6;
  margin: 0;
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 160%;
  color: #4A5568;
  margin: 0;
`;

const ContactButton = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  background: #003CA6;
  border-radius: 30px;
  color: #FFFFFF;
  text-decoration: none;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;
