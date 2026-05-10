'use client';

import { useId } from 'react';
import styled from 'styled-components';

export function ForCreatorsHeroBackground() {
  const uid = useId().replace(/:/g, '');
  const ids = {
    mask: `for-creators-hero-mask-${uid}`,
    blur0: `for-creators-hero-blur0-${uid}`,
    blur1: `for-creators-hero-blur1-${uid}`,
    blur2: `for-creators-hero-blur2-${uid}`,
    blur3: `for-creators-hero-blur3-${uid}`,
    blur4: `for-creators-hero-blur4-${uid}`,
    blur5: `for-creators-hero-blur5-${uid}`,
    gradient0: `for-creators-hero-gradient0-${uid}`,
    gradient1: `for-creators-hero-gradient1-${uid}`,
  };

  return (
    <BackgroundWrapper>
      <svg viewBox="0 0 1440 670" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <rect width="1440" height="670" fill={`url(#${ids.gradient0})`} />
        <rect width="1440" height="670" fill="#B4CFFF" />

        <mask id={ids.mask} maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="670" style={{ maskType: 'alpha' }}>
          <rect width="1440" height="670" fill={`url(#${ids.gradient1})`} />
          <rect width="1440" height="670" fill="#061530" />
        </mask>

        <g mask={`url(#${ids.mask})`}>
          <g filter={`url(#${ids.blur0})`}>
            <path d="M-398 228.131L-138.549 1721.61C-138.549 1721.61 635.042 648.601 1676.14 296.016C639.095 647.228 -398 228.131 -398 228.131Z" fill="#0859EA" />
          </g>
          <g filter={`url(#${ids.blur1})`}>
            <path d="M2451.99 -509L2766.03 609.881C2766.03 609.881 1710.66 312.597 683.745 630.161C1706.66 313.834 2451.99 -509 2451.99 -509Z" fill="#447EE2" />
          </g>
          <g filter={`url(#${ids.blur2})`}>
            <path d="M-364.414 421.465L-172.135 1528.29C-172.135 1528.29 444.692 718.337 1266.22 440.112C447.891 717.254 -364.414 421.465 -364.414 421.465Z" fill="#2068E4" />
          </g>
          <g filter={`url(#${ids.blur3})`}>
            <path d="M2492.64 -364.163L2725.38 465.04C2725.38 465.04 1926.28 249.969 1145.75 491.341C1923.24 250.909 2492.64 -364.163 2492.64 -364.163Z" fill="#6395ED" />
          </g>
          <g filter={`url(#${ids.blur4})`}>
            <path d="M-328.311 629.291L-207.681 1323.67C-207.681 1323.67 344.378 759.63 1049.34 520.883C347.122 758.701 -328.311 629.291 -328.311 629.291Z" fill="#639CFF" />
          </g>
          <g filter={`url(#${ids.blur5})`}>
            <path d="M2536.34 -208.461L2682.35 311.752C2682.35 311.752 2001.9 232.216 1306.54 447.249C1999.2 233.053 2536.34 -208.461 2536.34 -208.461Z" fill="#E0DED6" />
          </g>
        </g>

        <defs>
          <filter id={ids.blur0} x="-498" y="128.131" width="2274.14" height="1693.48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur1} x="583.745" y="-609" width="2282.28" height="1339.16" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur2} x="-399.414" y="386.465" width="1700.64" height="1176.82" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="17.5" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur3} x="1110.75" y="-399.163" width="1649.63" height="925.504" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="17.5" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur4} x="-392.311" y="456.883" width="1505.65" height="930.789" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="32" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur5} x="1274.54" y="-240.461" width="1439.81" height="719.709" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur" />
          </filter>
          <linearGradient id={ids.gradient0} x1="720" y1="0" x2="720" y2="670" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6395ED" />
            <stop offset="1" stopColor="#003CA6" />
          </linearGradient>
          <linearGradient id={ids.gradient1} x1="720" y1="0" x2="720" y2="670" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6395ED" />
            <stop offset="1" stopColor="#003CA6" />
          </linearGradient>
        </defs>
      </svg>
    </BackgroundWrapper>
  );
}

const BackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
