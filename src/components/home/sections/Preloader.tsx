'use client';

import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const StyledPreloader = styled.div<{ $isHiding: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${({ theme }) => theme.zIndex.modal + 100};
  background: ${({ theme }) => theme.colors.bgDark};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ $isHiding }) => $isHiding ? fadeOut : 'none'} 0.5s ease-out forwards;
`;

const PreloadPage = styled.div`
  img {
    animation: ${fadeInRight} ${({ theme }) => theme.motion.duration.slow} ${({ theme }) => theme.motion.easing.easeInOut};
  }
`;

export function Preloader() {
  const [isHiding, setIsHiding] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Wait for initial content to load
    const hideTimer = setTimeout(() => {
      setIsHiding(true);
      
      // Remove from DOM after fade-out animation
      setTimeout(() => {
        setIsHidden(true);
      }, 500);
    }, 1000); // Show preloader for 1 second

    return () => clearTimeout(hideTimer);
  }, []);

  if (isHidden) {
    return null;
  }

  return (
    <StyledPreloader id="preloader" $isHiding={isHiding}>
      <PreloadPage className="preload-page">
        <img
          src="/metub/template/images/3brothers-logo-color-mark.png"
          width="675"
          height="200"
          alt="3BROTHERS NETWORK | The Leading Creator Economy Platform"
          className="animated-sm fadeInRight"
        />
      </PreloadPage>
    </StyledPreloader>
  );
}
