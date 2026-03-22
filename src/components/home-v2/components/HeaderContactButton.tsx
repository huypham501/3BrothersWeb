'use client';

import styled from 'styled-components';
import Link from 'next/link';

interface HeaderContactButtonProps {
  $isFloating: boolean;
  href: string;
}

export function HeaderContactButton({ $isFloating, href }: HeaderContactButtonProps) {
  return (
    <ContactButton href={href} $isFloating={$isFloating}>
      Liên hệ ngay
      <IconCircle $isFloating={$isFloating}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </IconCircle>
    </ContactButton>
  );
}

const ContactButton = styled(Link) <{ $isFloating: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 4px 4px 36px;
  gap: 24px;
  background: ${({ $isFloating }) => $isFloating ? '#003CA6' : '#FFFFFF'};
  border-radius: 44px;
  color: ${({ $isFloating }) => $isFloating ? '#FFFFFF' : '#061530'};
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 160%;
  text-decoration: none;
`;

const IconCircle = styled.div<{ $isFloating: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 40px;
  height: 40px;
  background: ${({ $isFloating }) => $isFloating ? '#FFFFFF' : '#003CA6'};
  border-radius: 24px;
  transition: background 0.3s ease;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ $isFloating }) => $isFloating ? '#003CA6' : '#FFFFFF'};
    transition: color 0.3s ease;
  }
`;
