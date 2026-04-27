'use client';

import { useId } from 'react';
import styled from 'styled-components';

export function HeroBackgroundGraphics() {
  const uid = useId().replace(/:/g, '');
  const ids = {
    shadow: `hero-shadow-${uid}`,
    mask: `hero-mask-${uid}`,
    blur1: `hero-blur-1-${uid}`,
    blur2: `hero-blur-2-${uid}`,
    blur3: `hero-blur-3-${uid}`,
    blur4: `hero-blur-4-${uid}`,
    blur5: `hero-blur-5-${uid}`,
    blur6: `hero-blur-6-${uid}`,
    gradientBg: `hero-gradient-bg-${uid}`,
  };

  return (
    <BackgroundWrapper>
      <svg
        viewBox="0 52 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin slice"
      >
        <g filter={`url(#${ids.shadow})`}>
          <mask
            id={ids.mask}
            maskUnits="userSpaceOnUse"
            x="0"
            y="52"
            width="1440"
            height="800"
            style={{ maskType: 'alpha' }}
          >
            <path
              d="M0 52H1440V660C1440 727.206 1440 760.809 1426.92 786.479C1415.42 809.058 1397.06 827.416 1374.48 838.921C1348.81 852 1315.21 852 1248 852H192C124.794 852 91.1905 852 65.5211 838.921C42.9417 827.416 24.584 809.058 13.0792 786.479C0 760.809 0 727.206 0 660V52Z"
              fill="#FFFFFF"
            />
          </mask>

          <g mask={`url(#${ids.mask})`}>
            <g filter={`url(#${ids.blur1})`}>
              <path d="M-235 344.516L24.4506 1838C24.4506 1838 798.042 764.986 1839.14 412.401C802.095 763.613 -235 344.516 -235 344.516Z" fill="#00328A" />
            </g>
            <g filter={`url(#${ids.blur2})`}>
              <path d="M2528.55 -264.67L2788 868.113C2788 868.113 1748.28 520.041 707.181 787.471C1744.23 521.082 2528.55 -264.67 2528.55 -264.67Z" fill="#003CA6" />
            </g>
            <g filter={`url(#${ids.blur3})`}>
              <path d="M-201.415 537.85L-9.13562 1644.67C-9.13562 1644.67 607.692 834.722 1429.22 556.497C610.89 833.639 -201.415 537.85 -201.415 537.85Z" fill="#003CA6" />
            </g>
            <g filter={`url(#${ids.blur4})`}>
              <path d="M2562.14 -118.033L2754.41 721.473C2754.41 721.473 1966.68 467.934 1175.37 671.2C1963.6 468.726 2562.14 -118.033 2562.14 -118.033Z" fill="#6395ED" />
            </g>
            <g filter={`url(#${ids.blur5})`}>
              <path d="M-165.31 745.676L-44.6809 1440.06C-44.6809 1440.06 507.378 876.015 1212.34 637.268C510.123 875.086 -165.31 745.676 -165.31 745.676Z" fill="#639CFF" />
            </g>
            <g filter={`url(#${ids.blur6})`}>
              <path d="M2598.24 39.6035L2718.87 566.28C2718.87 566.28 2043.08 453.866 1338.11 634.952C2040.33 454.571 2598.24 39.6035 2598.24 39.6035Z" fill="#E0DED6" />
            </g>
          </g>
        </g>

        <defs>
          <filter id={ids.shadow} x="-40" y="36" width="1520" height="880" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="24" />
            <feGaussianBlur stdDeviation="20" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
          <filter id={ids.blur1} x="-335" y="244.516" width="2274.14" height="1693.48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur2} x="607.181" y="-364.67" width="2280.82" height="1332.78" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur3} x="-236.415" y="502.85" width="1700.64" height="1176.82" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="17.5" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur4} x="1140.37" y="-153.033" width="1649.05" height="909.506" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="17.5" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur5} x="-229.31" y="573.268" width="1505.65" height="930.789" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="32" result="effect1_foregroundBlur" />
          </filter>
          <filter id={ids.blur6} x="1306.11" y="7.60352" width="1444.76" height="659.348" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur" />
          </filter>
        </defs>
      </svg>
    </BackgroundWrapper>
  );
}

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
