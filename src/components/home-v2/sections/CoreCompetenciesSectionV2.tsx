'use client';

import styled from 'styled-components';

const SERVICES = [
  {
    title: 'Influencer Management',
    description: '3Brothers Media cung cấp nền tảng quản lý Influencer chuyên nghiệp với quy trình chọn lọc, đào tạo phát triển và tối ưu hình ảnh cá nhân cho từng talent.',
  },
  {
    title: 'Campaign Strategy',
    description: 'Tư vấn chiến lược triển khai campaign hiệu quả, đánh trúng insight khách hàng với phương pháp kết hợp sức mạnh mạng lưới Influencer rộng lớn.',
  },
  {
    title: 'Content production',
    description: 'Đội ngũ sản xuất nội dung giàu kinh nghiệm đảm bảo chất lượng hình ảnh, video với phong cách trending, thu hút tương tác tự nhiên cao nhất.',
  },
  {
    title: 'Event planning',
    description: 'Tổ chức các sự kiện quảng bá truyền thông chuyên nghiệp trong và ngoài nước, kết nối mạng lưới nhãn hàng cùng các content creators.',
  }
];

export function CoreCompetenciesSectionV2() {
  return (
    <SectionContainer>
      <Title>Năng lực cốt lõi</Title>
      
      <GridContainer>
        {SERVICES.map((service, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <ArrowIcon>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </ArrowIcon>
            </CardHeader>
            <CardDescription>{service.description}</CardDescription>
            <ImagePlaceholder>Image Illustration</ImagePlaceholder>
          </Card>
        ))}
      </GridContainer>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  width: 100%;
  padding: 120px 80px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  font-family: 'Montserrat', 'Inter', sans-serif;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 68px;
  line-height: 120%;
  text-align: center;
  text-transform: uppercase;
  color: #003CA6; /* Blue brand color */
  margin: 0;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  width: 100%;
  max-width: 1280px;
`;

const Card = styled.div`
  background: #FFFFFF;
  border-radius: 40px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0px 20px 40px rgba(6, 21, 48, 0.05);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0px 30px 60px rgba(6, 21, 48, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CardTitle = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0D1E44;
  margin: 0;
`;

const ArrowIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #F3F6FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #003CA6;
  cursor: pointer;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const CardDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #4A5568;
  margin: 0;
  max-width: 90%;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 20px;
  background: #EAF0FF;
  margin-top: auto; /* Pushes the image to the bottom if text varies */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #003CA6;
  font-weight: 500;
  font-size: 14px;
  border: 1px dashed #AEC2F2;
`;
