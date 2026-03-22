'use client';

import styled from 'styled-components';

export function HeroBackgroundGraphics() {
  return (
    <BackgroundWrapper>
      <svg 
        viewBox="0 0 1440 801" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin slice"
      >
        <g style={{ transform: 'translate(-225px, -340px)' }}>
          <path d="M-10 629.016L249.451 2122.5C249.451 2122.5 1023.04 1049.49 2064.14 696.901C1027.1 1048.11 -10 629.016 -10 629.016Z" fill="#00328A" style={{ filter: 'blur(50px)' }} />
          <path d="M2753.55 19.8301L3013 1152.61C3013 1152.61 1973.28 804.541 932.181 1071.97C1969.23 805.582 2753.55 19.8301 2753.55 19.8301Z" fill="#003CA6" style={{ filter: 'blur(50px)' }} />
          <path d="M23.5854 822.35L215.864 1929.17C215.864 1929.17 832.692 1119.22 1654.22 840.997C835.89 1118.14 23.5854 822.35 23.5854 822.35Z" fill="#003CA6" style={{ filter: 'blur(17.5px)' }} />
          <path d="M2787.14 166.467L2979.41 1005.97C2979.41 1005.97 2191.68 752.434 1400.37 955.7C2188.6 753.226 2787.14 166.467 2787.14 166.467Z" fill="#6395ED" style={{ filter: 'blur(16px)' }} />
          <path d="M59.6899 1030.18L180.319 1724.56C180.319 1724.56 732.378 1160.52 1437.34 921.768C735.123 1159.59 59.6899 1030.18 59.6899 1030.18Z" fill="#639CFF" style={{ filter: 'blur(32px)' }} />
          <path d="M2823.24 324.104L2943.87 850.78C2943.87 850.78 2268.08 738.366 1563.11 919.452C2265.33 739.071 2823.24 324.104 2823.24 324.104Z" fill="#E0DED6" style={{ filter: 'blur(16px)' }} />
        </g>
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
