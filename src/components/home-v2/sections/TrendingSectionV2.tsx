'use client';

import styled from 'styled-components';

const NEWS_DATA = [
  {
    title: "2025 - Một năm tăng tốc Media trong hệ sinh thái Influence",
    date: "12 JAN 2026"
  },
  {
    title: "Đồng hành cùng chương trình 'Xuân Về Bản Em 2026'",
    date: "12 JAN 2026"
  },
  {
    title: "3BROTHERS MEDIA x WECHOICE AWARDS 2025",
    date: "12 JAN 2026"
  }
];

export function TrendingSectionV2() {
  return (
    <SectionContainer>
      <HeaderRow>
        <Title>Xu hướng có gì?</Title>
        <ViewAllLink href="#">
          Xem tất cả
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </ViewAllLink>
      </HeaderRow>
      
      <CardsGrid>
        {NEWS_DATA.map((news, index) => (
          <NewsCard key={index}>
            <CardImage />
            <CardContent>
              <CardDate>{news.date}</CardDate>
              <CardTitle>{news.title}</CardTitle>
            </CardContent>
          </NewsCard>
        ))}
      </CardsGrid>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  padding: 120px 80px;
  background: #031027; /* Dark blue background */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  color: #FFFFFF;
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  max-width: 1280px;
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 68px;
  line-height: 120%;
  text-transform: uppercase;
  margin: 0;
`;

const ViewAllLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: #FFFFFF;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.9;

  &:hover {
    text-decoration: underline;
    opacity: 1;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  width: 100%;
  max-width: 1280px;
`;

const NewsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-8px);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 280px;
  border-radius: 30px;
  background: linear-gradient(180deg, #A48B8B, #4C3C3C);
  border: 2px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.6);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  
  &::after {
    content: 'Article Image Placeholder';
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardDate = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #AEC2F2;
  text-transform: uppercase;
`;

const CardTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 140%;
  color: #FFFFFF;
  margin: 0;
`;
