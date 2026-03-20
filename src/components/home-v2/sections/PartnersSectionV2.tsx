'use client';

import styled from 'styled-components';

export function PartnersSectionV2() {
  const partners = [
    "Gillette", "Dior", "L'Oreal", "Klairs", "YSL", "MONO TALK", "Grab", "closeup"
  ];

  return (
    <PartnersContainer>
      <LogosWrapper>
        {partners.map((partner, index) => (
          <LogoTextPlaceholder key={index}>
            {partner}
          </LogoTextPlaceholder>
        ))}
      </LogosWrapper>
    </PartnersContainer>
  );
}

const PartnersContainer = styled.section`
  width: 100%;
  height: 120px;
  background: #031027; /* Dark blue bridging the hero and next section */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* Shift it up slightly to tuck under the Hero's border-radius if needed */
  margin-top: -60px;
  padding-top: 60px; /* offset the margin */
  z-index: 1; 
`;

const LogosWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 63px; /* From CSS */
  max-width: 1363px;
  width: 100%;
  padding: 0 40px;
  justify-content: space-between;
  opacity: 0.8;
`;

const LogoTextPlaceholder = styled.div`
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
