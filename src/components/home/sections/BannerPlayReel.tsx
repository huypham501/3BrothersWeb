'use client';

import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
`;

const PlayReelRoot = styled.div.attrs(() => ({
  className: "play-reel"
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 16px;
  bottom: 48px;
  width: 120px;
  height: 120px;

  @media only screen and (min-width: 768px) {
    left: 24px;
    bottom: 24px;
  }

  @media only screen and (min-width: 992px) {
    left: 7.77778%;
    bottom: 8.88889%;
    width: 160px;
    height: 160px;
  }

  .play-reel-anchor {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: url("/metub/template/images/icons/play-reel.svg") no-repeat center
      center;
    background-size: 100% 100%;
  }

  .play-reel-anchor.anim {
    transition: all 300ms linear;
    animation: ${rotate} 5s linear infinite;
  }

  .ico-play {
    background-image: url("/metub/template/images/sprites-s419f43b832.png");
    background-position: 0 -1021px;
    background-repeat: no-repeat;
    overflow: hidden;
    height: 32px;
    width: 32px;
    display: inline-block;
  }
`;

export type BannerPlayReelProps = {
  href?: string;
};

export function BannerPlayReel({ href = "#" }: BannerPlayReelProps) {
  return (
    <PlayReelRoot>
      <a className="play-reel-anchor" href={href}></a>
      <i className="ico-play"></i>
    </PlayReelRoot>
  );
}
