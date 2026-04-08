'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { HeaderContactButton } from '../components/HeaderContactButton';

export function HeaderV2() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFloating(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderContainer>
      <NavBarPill $isFloating={isFloating}>
        <LogoContainer>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoText $isFloating={isFloating}>3BROTHERS</LogoText>
          </Link>
        </LogoContainer>

        <NavLinks>
          <NavItem href="/for-creators" $isFloating={isFloating}>For Creators</NavItem>
          <NavItem href="/for-brands" $isFloating={isFloating}>For Brands</NavItem>
          <NavItem href="/our-brand" $isFloating={isFloating}>Our Brands</NavItem>
          <NavItem href="/blogs" $isFloating={isFloating}>Blogs</NavItem>
          <NavItem href="/careers" $isFloating={isFloating}>Careers</NavItem>

          <HeaderContactButton href="#" $isFloating={isFloating} />
        </NavLinks>
      </NavBarPill>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 164px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 35px;
  z-index: 100;
  pointer-events: none; /* Let clicks pass through the huge container if they miss the pill */
`;

const NavBarPill = styled.div<{ $isFloating: boolean }>`
  pointer-events: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px 12px 32px;
  width: 100%;
  max-width: 1369px; /* Max width from design */
  height: 72px;
  
  background: ${({ $isFloating }) => $isFloating ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 13, 37, 0.45)'};
  backdrop-filter: blur(12px);
  border-radius: 40px;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 12px 12px 12px 24px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoText = styled.span<{ $isFloating: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 28px;
  color: ${({ $isFloating }) => $isFloating ? '#061530' : '#FFFFFF'};
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  
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
  gap: 40px;

  @media (max-width: 1024px) {
    display: none; /* Hide nav links on tablet/mobile for now, or adapt later */
  }
`;

const NavItem = styled(Link) <{ $isFloating: boolean }>`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 160%;
  color: ${({ $isFloating }) => $isFloating ? '#061530' : '#FFFFFF'};
  text-decoration: none;
`;


