'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import styled, { css } from 'styled-components';
import { Container } from '@/components/primitives/Container';
import { Button } from '@/components/ui/Button';
import { mq, mqMax } from '@/styles/mediaQueries';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <HeaderElement>
      <Container>
        <Navbar>
          <LogoWrapper>
            <Link href="/" aria-label="3brothers home">
              <Image
                src="/metub/template/images/3brothers-logo-white.png"
                width={91}
                height={23}
                alt="3BROTHERS NETWORK | The Leading Creator Economy Platform"
              />
            </Link>
          </LogoWrapper>
          
          <NavbarToggler 
            $active={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            <span />
          </NavbarToggler>

          <NavbarCollapse $show={isMenuOpen}>
            <NavbarNav>
              <NavItem>
                <NavLink
                  href="/for-creators"
                  $active={pathname === '/for-creators'}
                  aria-current={pathname === '/for-creators' ? 'page' : undefined}
                >
                  For Creators
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="/for-brands"
                  $active={pathname === '/for-brands'}
                  aria-current={pathname === '/for-brands' ? 'page' : undefined}
                >
                  For Brands
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/social-commerce">
                  Social Commerce
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="/our-brand"
                  $active={pathname === '/our-brand'}
                  aria-current={pathname === '/our-brand' ? 'page' : undefined}
                >
                  Our Brands
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/blog">
                  Blog
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/careers">
                  Careers
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="/login"
                  $active={pathname === '/login'}
                  aria-current={pathname === '/login' ? 'page' : undefined}
                >
                  Log In
                </NavLink>
              </NavItem>
            </NavbarNav>

            <NavbarRight>
              <Button 
                as={Link} 
                href="/get-in-touch" 
                $variant="gradient" 
                $rounded
              >
                Get in touch
              </Button>
            </NavbarRight>
          </NavbarCollapse>
        </Navbar>
      </Container>
    </HeaderElement>
  );
}

// ============================================
// Styled Components
// ============================================


const HeaderElement = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  background-color: transparent;
  padding: ${({ theme }) => theme.spacing.md} 0;

  ${mq.md} {
    padding: 24px 0;
  }

  ${mq.lg} {
    padding: 40px 0;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.header + 10};

  a {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
  }

  img {
    max-height: 40px;
    width: auto;

    ${mq.md} {
      max-height: 48px;
    }
  }
`;

const Navbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};

  ${mq.lg} {
    justify-content: center;
  }
`;

const NavbarToggler = styled.button<{ $active?: boolean }>`
  border: none;
  background-color: transparent;
  position: relative;
  width: 24px;
  height: 24px;
  padding: 0 1px;

  ${mq.lg} {
    display: none;
  }

  &::before,
  &::after,
  span {
    display: block;
    position: absolute;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: transform ${({ theme }) => theme.motion.duration.base}
      cubic-bezier(0.73, 1, 0.28, 0.08);
  }

  &::before,
  &::after {
    content: '';
    width: 11px;
  }

  &::before {
    right: 1px;
    top: 5px;
  }

  &::after {
    left: 1px;
    bottom: 5px;
  }

  span {
    width: 22px;
    top: 50%;
    margin-top: -1px;
  }

  /* Active state */
  ${({ $active }) =>
    $active &&
    css`
      ${mqMax.lg} {
        position: absolute;
        top: 16px;
        right: 24px;
        z-index: 100;

        &::before,
        &::after {
          background-color: ${({ theme }) => theme.colors.white};
        }

        ${mqMax.md} {
          top: 8px;
          right: 16px;
        }
      }

      span {
        display: none;
      }

      &::before,
      &::after {
        width: 22px;
        top: 50%;
      }

      &::before {
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }
    `}
`;

const NavbarCollapse = styled.div<{ $show?: boolean }>`
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md};

  ${mq.lg} {
    display: flex !important;
    flex-direction: row;
    position: static;
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    flex: 1;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const NavbarNav = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: ${({ theme }) => theme.spacing.sm};

  ${mq.lg} {
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const NavItem = styled.li`
  /* No additional styling needed */
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  transition: color ${({ theme }) => `${theme.motion.duration.fast} ${theme.motion.easing.easeInOut}`};

  ${mq.lg} {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.white};
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $active }) =>
    $active &&
    css`
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      color: ${({ theme }) => theme.colors.primary};
    `}
`;

const NavbarRight = styled.div`
  padding: ${({ theme }) => theme.spacing.md};

  ${mq.lg} {
    padding: 0;
  }
`;
