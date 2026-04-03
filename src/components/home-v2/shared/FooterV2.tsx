'use client';

import styled from 'styled-components';
import Link from 'next/link';

// Simple radial gradient behind the huge text to give the glow effect
export function FooterV2() {
  return (
    <FooterContainer>
      <GlowEffect />
      <TopRow>
        <LeftSide>
          <Heading>CẢM ƠN SỰ TIN TƯỞNG CỦA QUÍ ĐỐI TÁC</Heading>
          <ContactInfo>
            <div><strong>EMAIL:</strong> work.3brothers@gmail.com</div>
            <div><strong>ĐỊA CHỈ:</strong> 123 Phan Văn Giang, Phú Nhuận, Hồ Chí Minh</div>
          </ContactInfo>
        </LeftSide>
        
        <RightSide>
          <LinkGroup>
            <LinkTitle>MENU</LinkTitle>
            <FooterLink href="/for-brands">For Brands</FooterLink>
            <FooterLink href="/for-creators">For Creators</FooterLink>
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Careers</FooterLink>
            <FooterLink href="/blogs">Blogs</FooterLink>
          </LinkGroup>
          
          <LinkGroup>
            <LinkTitle>CONTACT</LinkTitle>
            <FooterLink href="#">Facebook</FooterLink>
            <FooterLink href="#">Instagram</FooterLink>
            <FooterLink href="#">Tiktok</FooterLink>
            <FooterLink href="#">Thread</FooterLink>
          </LinkGroup>
        </RightSide>
      </TopRow>
      
      <HugeTextContainer>
        <HugeText>3BROTHERS.MEDIA</HugeText>
      </HugeTextContainer>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  position: relative;
  background: #00328A; /* Base dark blue from design */
  padding: 80px 80px 0 80px;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 10;
`;

const LeftSide = styled.div`
  max-width: 600px;
`;

const Heading = styled.h2`
  font-weight: 700;
  font-size: 48px;
  line-height: 120%;
  margin: 0 0 40px 0;
  text-transform: uppercase;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  opacity: 0.8;
  
  strong {
    font-weight: 600;
    margin-right: 8px;
  }
`;

const RightSide = styled.div`
  display: flex;
  gap: 80px;
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LinkTitle = styled.h4`
  font-weight: 600;
  font-size: 14px;
  opacity: 0.5;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
`;

const FooterLink = styled(Link)`
  color: #FFFFFF;
  font-size: 16px;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  opacity: 0.9;
  
  &:hover {
    text-decoration: underline;
  }
`;

const HugeTextContainer = styled.div`
  margin-top: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 40px;
  z-index: 10;
`;

const HugeText = styled.h1`
  font-weight: 800;
  font-size: 10vw; /* Scales with screen width */
  margin: 0;
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.9;
  letter-spacing: -0.05em;
  text-align: center;
  width: 100%;
  border-bottom: 2px solid rgba(255,255,255,0.1);
  line-height: 1;
`;

const GlowEffect = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 149, 237, 0.4) 0%, rgba(0, 60, 166, 0) 70%);
  z-index: 1;
  pointer-events: none;
`;
