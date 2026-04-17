'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries } from '@/styles/tokens';

// ── Data ──────────────────────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    num: '01',
    title: 'Đa dạng hoá',
    desc: 'Mở rộng sự hiện diện thương hiệu cá nhân tới đa dạng nền tảng và nhiều kênh kinh doanh khác nhau'
  },
  {
    num: '02',
    title: 'Kết nối',
    desc: 'Tìm kiếm tệp người xem phù hợp, phát triển cộng đồng và chuyển đổi người theo dõi thành khách hàng trung thành'
  },
  {
    num: '03',
    title: 'Thu nhập đa dạng',
    desc: 'Xây dựng nguồn thu nhập bổ sung từ sáng tạo nội dung. Tìm kiếm người tiêu dùng và tạo ra doanh thu bền vững'
  }
];

// ── Component ─────────────────────────────────────────────────────────────────

export function ValuePropositionSection() {
  return (
    <SectionContainer>
      <Inner>
        <Header>
          <Title>Giá trị tạo nên sự khác biệt</Title>
          <Subtitle>
            Chúng tôi giúp Creator & KOL sống với đam mê bằng cách cung cấp công cụ mới để monetize từ thương hiệu cá nhân và nội dung sáng tạo
          </Subtitle>
        </Header>

        <GridWrapper>
          {VALUE_PROPS.map((prop, idx) => (
            <Column key={idx}>
              <Number>{prop.num}</Number>
              <ContentStack>
                <ColTitle>{prop.title}</ColTitle>
                <ColDesc>{prop.desc}</ColDesc>
              </ContentStack>
              {idx < VALUE_PROPS.length - 1 && <Divider />}
            </Column>
          ))}
        </GridWrapper>
      </Inner>
    </SectionContainer>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  width: 100%;
  background: ${colors.white};
  display: flex;
  justify-content: center;
  padding: 120px 0;

  ${mediaQueries.down.lg} {
    padding: 80px 0;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  padding: 0 84px;

  ${mediaQueries.down.lg} {
    padding: 0 40px;
    gap: 60px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 20px;
    gap: 40px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 909px;
  text-align: center;
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
  color: ${colors.primary};
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: rgba(6, 21, 48, 0.8);
  margin: 0;
`;

const GridWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 1281px;

  ${mediaQueries.down.lg} {
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 40px;
    row-gap: 60px;
  }

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: center;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 373.67px;
  position: relative;
  gap: 80px;

  ${mediaQueries.down.lg} {
    width: 320px;
    gap: 40px;
  }

  ${mediaQueries.down.sm} {
    width: 100%;
    align-items: center;
    text-align: center;
  }
`;

const Number = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 110px;
  line-height: 140%;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: #B4CFFF;

  ${mediaQueries.down.md} {
    font-size: 80px;
  }
`;

const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;

  ${mediaQueries.down.sm} {
    align-items: center;
  }
`;

const ColTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.secondaryDark};
  margin: 0;
`;

const ColDesc = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: ${colors.secondaryDark};
  margin: 0;
`;

// Divider represents the 1px line rotated 90deg in design between columns
const Divider = styled.div`
  position: absolute;
  width: 1px;
  height: 320px;
  background: ${colors.secondaryDark};
  opacity: 0.2;
  right: -55px; /* Adjust based on exact gap required between columns */
  top: 50%;
  transform: translateY(-50%);

  ${mediaQueries.down.lg} {
    display: none;
  }
`;
