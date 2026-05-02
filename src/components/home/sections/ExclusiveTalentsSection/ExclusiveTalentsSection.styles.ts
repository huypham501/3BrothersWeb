import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

export const SectionGlowWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  overflow: visible;
  isolation: isolate;
`;

export const SectionContainer = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  background: #061530;
  border-radius: 120px;
  padding: 120px 84px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  color: ${colors.white};
  overflow: hidden;
  isolation: isolate;

  ${mediaQueries.down.sm} {
    padding: 64px ${spacing.lg} 60px;
    gap: 40px;
    border-radius: 60px;
  }
`;

export const GlowEllipse1 = styled.div`
  position: absolute;
  width: 741px;
  height: 745px;
  left: 39px;
  top: 18.2%;
  background: #003ca6;
  opacity: 0.4;
  filter: blur(60px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
`;

export const GlowEllipse2 = styled.div`
  position: absolute;
  width: 637px;
  height: 641px;
  left: 91px;
  top: 22.2%;
  background: #003ca6;
  opacity: 0.4;
  filter: blur(60px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
`;

export const GlowEllipseBottom = styled.div`
  position: absolute;
  width: 1547px;
  height: 709px;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  background: #003ca6;
  opacity: 0.4;
  filter: blur(60px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;

  ${mediaQueries.down.sm} {
    width: 130vw;
    height: 56vw;
  }
`;

export const GlowEllipse12 = styled.div`
  position: absolute;
  width: 964.68px;
  height: 76.66px;
  left: 50%;
  top: 100%;
  background: #6395ed;
  opacity: 0.4;
  filter: blur(60px);
  transform: translateX(-50%) rotate(-26.13deg);
  pointer-events: none;
  z-index: 0;

  ${mediaQueries.down.sm} {
    width: 72vw;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 1025px;
  z-index: 1;

  ${mediaQueries.down.sm} {
    gap: 16px;
  }
`;

export const TitleLine = styled.div`
  flex: 1;
  height: 0;
  border-top: 0.5px solid rgba(255, 255, 255, 0.5);
`;

export const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
  text-align: center;
  color: ${colors.white};
  margin: 0;
  white-space: nowrap;

  ${mediaQueries.down.sm} {
    font-size: 24px;
  }
`;

export const MainTalentArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 1212px;
  z-index: 1;

  ${mediaQueries.down.lg} {
    flex-direction: column;
  }
`;

export const TalentPhotoMain = styled.div`
  flex: none;
  width: 560px;
  height: 560px;
  background: linear-gradient(180deg, #51496d, #302a41);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.md};
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;

  &::after {
    content: 'Nguyệt Busi Photo';
  }

  ${mediaQueries.down.lg} {
    width: 100%;
    height: 400px;
  }
`;

export const TalentInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 0 0 24px;
  gap: 12px;
  flex: 1;
  min-width: 0;
  max-width: 620px;

  ${mediaQueries.down.lg} {
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
`;

export const TalentName = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 140%;
  color: ${colors.white};
  margin: 0;
  word-break: break-word;
  align-self: stretch;

  ${mediaQueries.down.sm} {
    font-size: 40px;
  }
`;

export const TalentHandle = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.white};
  align-self: stretch;
  word-break: break-all;

  ${mediaQueries.down.sm} {
    font-size: 18px;
  }
`;

export const StatsBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px 0 12px;
  gap: 24px;
  align-self: stretch;
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
`;

export const StatValue = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.medium};
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
  color: ${colors.secondary};

  ${mediaQueries.down.sm} {
    font-size: 28px;
  }
`;

export const StatLabel = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: ${colors.white};
`;

export const DescriptionBlock = styled.div`
  display: flex;
  padding: 12px 0 0;
  align-self: stretch;
`;

export const DescriptionInner = styled.div`
  display: block;
  flex: 1;
  min-width: 0;
  position: relative;
`;

export const TalentDescription = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
`;

export const ReadMoreSuffix = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

export const ReadMoreButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  display: inline-block;
  margin-left: 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: inherit;
  color: ${colors.white};
  cursor: pointer;
  text-align: left;
  transition: opacity ${motion.duration.base} ease;
  vertical-align: baseline;
  white-space: nowrap;

  &:hover {
    opacity: 0.7;
  }
`;

export const MeasureDescription = styled.p`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  pointer-events: none;
  visibility: hidden;
  z-index: -1;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 150%;
  word-break: break-word;
  overflow-wrap: break-word;
`;

export const MeasureSuffix = styled.span`
  font-weight: ${typography.fontWeight.bold};
`;

export const BottomSlidersArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 1272px;
  z-index: 1;

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const VerticalText = styled.div`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  font-size: 42px;
  line-height: 140%;
  text-transform: uppercase;
  text-align: center;
  color: ${colors.white};
  opacity: 0.5;
  flex: none;

  ${mediaQueries.down.sm} {
    writing-mode: horizontal-tb;
    transform: none;
    font-size: 24px;
  }
`;

export const SliderTrack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

export const ThumbnailsRow = styled.div<{ $isDragging: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'grab')};
  user-select: none;
  touch-action: pan-y;
`;

export const TalentThumb = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: none;
  cursor: pointer;
  transition: transform ${motion.duration.base} ease;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? colors.secondary : 'transparent')};
  padding: 4px;

  &:hover {
    transform: translateY(-6px);
  }
`;

export const ThumbImagePlaceholder = styled.div`
  width: 240px;
  height: 240px;
  background: #1a2845;
  border-radius: 8px;
  flex: none;
`;

export const ThumbName = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: 140%;
  text-align: center;
  color: ${colors.white};
`;

export const ScrollbarTrack = styled.div<{ $isDragging: boolean }>`
  width: 118px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  position: relative;
  flex: none;
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'grab')};
  touch-action: none;
`;

export const ScrollbarFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 8px;
  width: 43px;
  background: ${colors.white};
  border-radius: 10px;
  transition: left ${motion.duration.fast} linear;
`;
