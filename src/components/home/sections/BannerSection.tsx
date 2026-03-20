'use client';

import styled from 'styled-components';
import { BannerPlayReel } from './BannerPlayReel';

export type BannerSectionProps = {
  height?: number;
  videoSrc?: string;
  posterSrc?: string;
};

export function BannerSection({
  height = 720,
  videoSrc = '/metub/template/images/metub_video.mp4',
  posterSrc = '/metub/template/images/upload/banner-v2.jpg'
}: BannerSectionProps) {
  return (
    <StyledBannerSection $height={height} data-height={height}>
      <BannerPlayVideo $height={height} className="banner-play-video" data-height={height}>
        <video
          preload="auto"
          autoPlay
          playsInline
          muted
          loop
          src={videoSrc}
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </BannerPlayVideo>
      <BannerPlayReel />
    </StyledBannerSection>
  );
}

const StyledBannerSection = styled.section<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  position: relative;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const BannerPlayVideo = styled.div<{ $height: number }>`
  position: relative;
  background-size: cover;
  background-position: center bottom;
  max-height: 100vh;
  height: ${({ $height }) => $height}px;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  img {
    width: 100%;
  }

  video {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
