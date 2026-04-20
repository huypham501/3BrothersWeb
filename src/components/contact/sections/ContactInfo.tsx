'use client';

import styled from 'styled-components';
import { colors, typography, mediaQueries, spacing } from '@/styles/tokens';

export function ContactInfo() {
  const beams = Array.from({ length: 22 }, (_, i) => {
    return { left: -40 + i * 66 };
  });

  return (
    <SectionContainer>
       <Ellipse15 />
       <Ellipse16 />
       
       <BeamsOverlay>
         {beams.map((b, i) => (
           <Beam key={i} style={{ left: b.left }} />
         ))}
       </BeamsOverlay>

       <Inner>
          <HeaderGroup>
            <Eyebrow>Thông tin liên hệ</Eyebrow>
            <Title>WE ARE ALWAYS HAPPY TO ASSIST YOU</Title>
          </HeaderGroup>

          <GridContainer>
             <InfoColumn>
                <ColumnHeader>
                  <ColumnTitle>Email Address</ColumnTitle>
                  <Divider />
                </ColumnHeader>
                <Details>
                  <DetailTitle>help@info.com</DetailTitle>
                  <DetailDesc>Assistance hours: Monday - Friday 6 am to 8 pm EST</DetailDesc>
                </Details>
             </InfoColumn>

             <InfoColumn>
                <ColumnHeader>
                  <ColumnTitle>Number</ColumnTitle>
                  <Divider />
                </ColumnHeader>
                <Details>
                  <DetailTitle>(808) 998-34256</DetailTitle>
                  <DetailDesc>Assistance hours: Monday - Friday 6 am to 8 pm EST</DetailDesc>
                </Details>
             </InfoColumn>
          </GridContainer>
       </Inner>
    </SectionContainer>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 544px;
  background: #6395ED;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Ellipse15 = styled.div`
  position: absolute;
  width: 1521px;
  height: 288px;
  left: -41px;
  bottom: -176px;
  background: #003CA6;
  filter: blur(120px);
  pointer-events: none;
`;

const Ellipse16 = styled.div`
  position: absolute;
  width: 991px;
  height: 188px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 514px;
  background: #FFFFFF;
  filter: blur(120px);
  pointer-events: none;
  z-index: 1;
`;

const BeamsOverlay = styled.div`
  position: absolute;
  width: 1520px;
  height: 800px;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 1;
`;

const Beam = styled.div`
  position: absolute;
  width: 134px;
  height: 590px;
  background: linear-gradient(222.85deg, rgba(255, 255, 255, 0) 49.5%, rgba(255, 255, 255, 0.6) 100%);
  filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.25));
  bottom: -200px; /* Base offset */
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1440px;
  padding: 80px 84px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 60px;
  justify-content: space-between;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    padding: 80px 40px;
    gap: 40px;
  }

  ${mediaQueries.down.sm} {
    padding: 60px 20px;
  }
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  max-width: 601px;
`;

const Eyebrow = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 20px;
  }
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
  color: #FFE773;
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 32px;
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 102px;
  flex: 1;

  ${mediaQueries.down.md} {
    flex-direction: column;
    gap: 40px;
  }
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0; /* Padding inside columns if needed, design shows 32px but it throws layout off sometimes if wrapper is tight */
  gap: 27px;
  flex: 1;
`;

const ColumnHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
  width: 100%;
`;

const ColumnTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.white};
  margin: 0;
  min-height: 36px;
`;

const Divider = styled.div`
  width: 100%;
  max-width: 185px; /* Adjust according to design */
  height: 3px;
  background: ${colors.white};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
  width: 100%;
`;

const DetailTitle = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.white};
  word-break: break-all;

  ${mediaQueries.down.md} {
    font-size: 22px;
  }
`;

const DetailDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 20px;
  line-height: 32px; /* 160% */
  color: ${colors.white};
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 16px;
  }
`;
