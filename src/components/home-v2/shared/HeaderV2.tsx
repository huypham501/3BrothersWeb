'use client';

import styled from 'styled-components';
import Link from 'next/link';

export function HeaderV2() {
  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoText>3BROTHERS</LogoText>
      </LogoContainer>

      <NavLinks>
        <NavItem href="#">For Creators</NavItem>
        <NavItem href="#">For Brands</NavItem>
        <NavItem href="#">Our Brands</NavItem>
        <NavItem href="#">Blogs</NavItem>
        <NavItem href="#">Careers</NavItem>
        
        <ContactButton href="#">
          Liên hệ ngay
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </ContactButton>
      </NavLinks>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 164px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  z-index: 100;
  /* Font setting applied globally or we ensure it here */
  font-family: 'Inter', sans-serif;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoText = styled.span`
  font-weight: 800;
  font-size: 28px;
  color: #0d1e44; // From the light blue background contrast
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  
  // A simple placeholder for the exact 3Brothers logo
  &::before {
    content: '';
    display: inline-block;
    width: 40px;
    height: 40px;
    background: #6395ED;
    border-radius: 20px;
    margin-right: 12px;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 48px;
`;

const NavItem = styled(Link)`
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  color: #0d1e44;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const ContactButton = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px 24px;
  gap: 8px;
  background: #003CA6;
  border-radius: 24px; // Pill shape from design
  color: #FFFFFF;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: #002266;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
