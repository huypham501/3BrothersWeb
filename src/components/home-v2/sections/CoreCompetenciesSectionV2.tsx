'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

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
  padding: 120px ${spacing['5xl']};
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing['5xl']};
  font-family: 'Montserrat', 'Inter', sans-serif;

  ${mediaQueries.down.sm} {
    padding: 60px ${spacing.lg};
    gap: ${spacing['2xl']};
  }
`;

const Title = styled.h2`
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 120%;
  text-align: center;
  text-transform: uppercase;
  color: ${colors.primary}; /* Blue brand color */
  margin: ${spacing[0]};

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['5xl']};
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing['2xl']};
  width: 100%;
  max-width: 1280px;

  ${mediaQueries.down.lg} {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${colors.white};
  border-radius: 40px;
  padding: ${spacing['3xl']};
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  box-shadow: 0px 20px 40px rgba(6, 21, 48, 0.05);
  position: relative;
  transition: transform ${motion.duration.base} ${motion.easing.easeOut}, box-shadow ${motion.duration.base} ${motion.easing.easeOut};

  ${mediaQueries.down.sm} {
    padding: ${spacing.xl};
  }

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
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['4xl']};
  line-height: 120%;
  color: ${colors.textPrimary};
  margin: ${spacing[0]};

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['2xl']};
  }
`;

const ArrowIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.full};
  background: ${colors.brandLightBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
  cursor: pointer;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const CardDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 150%;
  color: ${colors.textBody};
  margin: ${spacing[0]};
  max-width: 90%;

  ${mediaQueries.down.sm} {
    max-width: 100%;
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 20px;
  background: ${colors.brandLightBlue};
  margin-top: auto; /* Pushes the image to the bottom if text varies */
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.base};
  border: 1px dashed ${colors.brandLightBlueDark};
`;
