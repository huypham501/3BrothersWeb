'use client';

import styled from 'styled-components';

export function EfficiencySectionV2() {
  return (
    <SectionContainer>
      <TopHeader>
        <TextContent>
          <Title>Hiệu quả<br/>thực thi</Title>
          <Description>
            Chúng tôi cung cấp giải pháp Influencer Marketing & Talent Management chuyên nghiệp, giúp thương hiệu triển khai hiệu quả và xây dựng giá trị dài hạn.
          </Description>
        </TextContent>
        <ButtonGroup>
          <PrimaryButton href="#">
            Liên hệ tư vấn
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </PrimaryButton>
          <SecondaryButton href="#">Xem portfolio</SecondaryButton>
        </ButtonGroup>
      </TopHeader>

      <StatsCard>
        <StatItem>
          <StatNumber>30M+</StatNumber>
          <StatLabel>Lượt tiếp cận</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>30M+</StatNumber>
          <StatLabel>Video được sản xuất</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>30M+</StatNumber>
          <StatLabel>Lượt tiếp cận</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>30M+</StatNumber>
          <StatLabel>Lượt tiếp cận</StatLabel>
        </StatItem>
      </StatsCard>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  padding: 120px 80px;
  display: flex;
  flex-direction: column;
  gap: 80px;
  font-family: 'Montserrat', 'Inter', sans-serif;
`;

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`;

const TextContent = styled.div`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 68px;
  line-height: 110%;
  text-transform: uppercase;
  color: #003CA6;
  margin: 0;
`;

const Description = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #4A5568;
  margin: 0;
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
  background: #003CA6;
  border-radius: 24px;
  color: #FFFFFF;
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
  border: 1px solid #003CA6;
  border-radius: 24px;
  color: #003CA6;
  text-decoration: none;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 60, 166, 0.05);
  }
`;

const StatsCard = styled.div`
  width: 100%;
  background: #FFFFFF;
  border-radius: 40px;
  padding: 60px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 20px 40px rgba(6, 21, 48, 0.05);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex: 1;

  /* Separator lines between items except the last one */
  &:not(:last-child) {
    border-right: 1px solid #E2E8F0;
    margin-right: 40px;
  }
`;

const StatNumber = styled.div`
  font-weight: 800;
  font-size: 64px;
  line-height: 100%;
  color: #003CA6;
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  color: #4A5568;
  max-width: 140px;
`;
