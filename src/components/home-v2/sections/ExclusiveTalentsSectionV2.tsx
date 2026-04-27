'use client';

import styled, { css } from 'styled-components';
import Image from 'next/image';
import { useRef, useState, useEffect, useCallback } from 'react';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

// ── Constants ────────────────────────────────────────────────────────────────
const DESCRIPTION_LINE_HEIGHT_PX = 24; // 16px * 150%
const CLAMP_LINES = 4;
const CLAMP_MAX_HEIGHT = DESCRIPTION_LINE_HEIGHT_PX * CLAMP_LINES; // 96px

import { SharedExclusiveTalentsPayload } from '@/lib/cms/types';

// ── Component ────────────────────────────────────────────────────────────────
export function ExclusiveTalentsSectionV2({ content }: { content: SharedExclusiveTalentsPayload }) {
  const talents = content.talents || [];

  // ── Read-more state ──────────────────────────────────────────────────────
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isExpandable, setIsExpandable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    // scrollHeight > clamped height → text overflows 4 lines
    setIsExpandable(el.scrollHeight > CLAMP_MAX_HEIGHT + 2);
  }, []);

  // ── Custom scrollbar sync ────────────────────────────────────────────────
  const rowRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateScrollbar = useCallback(() => {
    const row = rowRef.current;
    const fill = fillRef.current;
    const track = trackRef.current;
    if (!row || !fill || !track) return;

    const scrollable = row.scrollWidth - row.clientWidth;
    if (scrollable <= 0) {
      fill.style.width = '100%';
      fill.style.left = '0px';
      return;
    }

    const trackW = track.clientWidth;
    const ratio = row.scrollLeft / scrollable;
    const fillW = Math.max(40, (row.clientWidth / row.scrollWidth) * trackW);
    const maxLeft = trackW - fillW;

    fill.style.width = `${fillW}px`;
    fill.style.left = `${ratio * maxLeft}px`;
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    updateScrollbar();
    row.addEventListener('scroll', updateScrollbar, { passive: true });
    window.addEventListener('resize', updateScrollbar);
    return () => {
      row.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [updateScrollbar]);

  // Track-click scrubbing
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return;
    const rect = track.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    row.scrollLeft = ratio * (row.scrollWidth - row.clientWidth);
  };

  return (
    <SectionContainer>
      {/* Background glow ellipses */}
      <GlowEllipse1 />
      <GlowEllipse2 />
      <GlowEllipseBottom />
      <GlowEllipse12 />

      {/* Title: line — TALENTS ĐỘC QUYỀN — line */}
      <TitleRow>
        <TitleLine />
        <Title>{content.section_title}</Title>
        <TitleLine />
      </TitleRow>

      {/* Main area: photo LEFT, info RIGHT */}
      <MainTalentArea>
        {content.featured_photo ? (
          <Image
            src={content.featured_photo}
            alt={content.featured_photo_alt || 'Featured Talent'}
            width={560}
            height={560}
            style={{
              flex: 'none',
              width: '560px',
              height: '560px',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
          />
        ) : (
          <TalentPhotoMain />
        )}

        <TalentInfoContent>
          <TalentName>{content.featured_name}</TalentName>
          <TalentHandle>{content.featured_handle}</TalentHandle>

          <StatsBlock>
            {content.featured_stats?.map((stat, idx) => (
              <Stat key={`stat-${idx}`}>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </Stat>
            ))}
          </StatsBlock>

          <DescriptionBlock>
            <DescriptionInner>
              <TalentDescription
                ref={descRef}
                $clamped={isExpandable && !isExpanded}
                $isExpanded={isExpanded}
                $maxHeight={CLAMP_MAX_HEIGHT}
              >
                {content.featured_description}
              </TalentDescription>
              {isExpandable && (
                <ReadMoreButton
                  onClick={() => setIsExpanded(v => !v)}
                  $clamped={!isExpanded}
                >
                  {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                </ReadMoreButton>
              )}
            </DescriptionInner>
          </DescriptionBlock>
        </TalentInfoContent>
      </MainTalentArea>

      {/* Bottom: 50+ TALENTS + scrollable thumbnails */}
      <BottomSlidersArea>
        <VerticalText>{content.talent_count_label}</VerticalText>

        <SliderTrack>
          <ThumbnailsRow ref={rowRef}>
            {talents.map((t, idx) => (
              <TalentThumb key={idx}>
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.photo_alt || t.name}
                    width={240}
                    height={240}
                    style={{ width: '240px', height: '240px', objectFit: 'cover', borderRadius: '8px', flex: 'none' }}
                  />
                ) : (
                  <ThumbImagePlaceholder />
                )}
                <ThumbName>{t.name}</ThumbName>
              </TalentThumb>
            ))}
          </ThumbnailsRow>

          <ScrollbarTrack ref={trackRef} onClick={handleTrackClick}>
            <ScrollbarFill ref={fillRef} />
          </ScrollbarTrack>
        </SliderTrack>
      </BottomSlidersArea>
    </SectionContainer>
  );
}

/* ─────────────────────────────── Container ─────────────────────────────── */

const SectionContainer = styled.section`
  position: relative;
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

/* ─────────────────────────────── Glow effects ─────────────────────────────── */

const GlowEllipse1 = styled.div`
  position: absolute;
  width: 741px;
  height: 745px;
  left: 39px;
  top: 233px;
  background: #003CA6;
  opacity: 0.4;
  filter: blur(60px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
`;

const GlowEllipse2 = styled.div`
  position: absolute;
  width: 637px;
  height: 641px;
  left: 91px;
  top: 285px;
  background: #003CA6;
  opacity: 0.4;
  filter: blur(60px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
`;

const GlowEllipseBottom = styled.div`
  position: absolute;
  width: 1547px;
  height: 709px;
  left: -37px;
  top: 1098px;
  background: #003CA6;
  opacity: 0.4;
  filter: blur(60px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
`;

const GlowEllipse12 = styled.div`
  position: absolute;
  width: 964.68px;
  height: 76.66px;
  left: calc(50% - 964.68px/2 + 32.34px);
  top: 1013.43px;
  background: #6395ED;
  opacity: 0.4;
  filter: blur(60px);
  transform: rotate(-26.13deg);
  pointer-events: none;
  z-index: 0;
`;

/* ─────────────────────────────── Title row ─────────────────────────────── */

const TitleRow = styled.div`
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

const TitleLine = styled.div`
  flex: 1;
  height: 0;
  border-top: 0.5px solid rgba(255, 255, 255, 0.5);
`;

const Title = styled.h2`
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

/* ─────────────────────────────── Main area ─────────────────────────────── */

const MainTalentArea = styled.div`
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

/* Photo — LEFT */
const TalentPhotoMain = styled.div`
  flex: none;
  width: 560px;
  height: 560px;
  background: linear-gradient(180deg, #51496D, #302A41);
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

/* Info — RIGHT */
const TalentInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 0 0 24px;
  gap: 12px;
  flex: 1;
  /* Prevent text from blowing out the flex row */
  min-width: 0;
  max-width: 620px;

  ${mediaQueries.down.lg} {
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
`;

const TalentName = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 140%;
  color: ${colors.white};
  margin: 0;
  /* Prevent very long names from overflowing */
  word-break: break-word;
  align-self: stretch;

  ${mediaQueries.down.sm} {
    font-size: 40px;
  }
`;

const TalentHandle = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.white};
  align-self: stretch;
  /* Prevent overflow */
  word-break: break-all;

  ${mediaQueries.down.sm} {
    font-size: 18px;
  }
`;

/* ─────────────────────────────── Stats ─────────────────────────────── */

const StatsBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px 0 12px;
  gap: 24px;
  align-self: stretch;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  /* prevent long stat values overflowing */
  min-width: 0;
`;

const StatValue = styled.div`
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

const StatLabel = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: ${colors.white};
`;

/* ─────────────────────────────── Description + Read-more ─────────────────────────────── */

const DescriptionBlock = styled.div`
  display: flex;
  padding: 12px 0 0;
  align-self: stretch;
`;

const DescriptionInner = styled.div`
  display: block;
  flex: 1;
  min-width: 0;
  position: relative;
`;

const TalentDescription = styled.p<{ $clamped: boolean; $isExpanded: boolean; $maxHeight: number }>`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  /* Allows text to flow naturally without breaking the row */
  word-break: break-word;
  overflow-wrap: break-word;

  ${({ $clamped, $isExpanded, $maxHeight }) =>
    $clamped ? css`
      overflow: hidden;
      max-height: ${$maxHeight}px;
      /* Webkit line clamp as progressive enhancement */
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
    ` : css`
      display: ${$isExpanded ? 'inline' : 'block'};
      max-height: none;
      overflow: visible;
    `}
`;

const ReadMoreButton = styled.button<{ $clamped?: boolean }>`
  background: none;
  border: none;
  padding: 0;
  display: inline-block;
  margin-left: 8px;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: inherit;
  color: ${colors.white};
  cursor: pointer;
  text-align: left;
  transition: opacity ${motion.duration.base} ease;
  vertical-align: baseline;

  ${({ $clamped }) =>
    $clamped &&
    css`
      position: absolute;
      right: 0;
      bottom: 0px;
      padding-left: 40px;
      /* Gradient to hide text behind the button */
      background: linear-gradient(to right, rgba(6, 21, 48, 0), #061530 40%);
      margin-left: 0;

      &::before {
        content: '... ';
        color: rgba(255, 255, 255, 0.6);
        font-weight: normal;
      }
    `}

  &:hover {
    opacity: 0.7;
  }
`;

/* ─────────────────────────────── Bottom slider ─────────────────────────────── */

const BottomSlidersArea = styled.div`
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

const VerticalText = styled.div`
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

const SliderTrack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  flex: 1;
  /* Critical: allow the child to overflow and scroll */
  min-width: 0;
  overflow: hidden;
`;

const ThumbnailsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
  /* stretch to the SliderTrack width, scroll internally */
  width: 100%;
  overflow-x: scroll;

  /* hide native scrollbar */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TalentThumb = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  /* fixed size so items don't flex-shrink */
  flex: none;
  cursor: pointer;
  transition: transform ${motion.duration.base} ease;

  &:hover {
    transform: translateY(-6px);
  }
`;

const ThumbImagePlaceholder = styled.div`
  width: 240px;
  height: 240px;
  background: #1A2845;
  border-radius: 8px;
  flex: none;
`;

const ThumbName = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: 140%;
  text-align: center;
  color: ${colors.white};
`;

/* ─────────────────────────────── Custom scrollbar ─────────────────────────────── */

const ScrollbarTrack = styled.div`
  width: 118px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  position: relative;
  flex: none;
  cursor: pointer;
`;

const ScrollbarFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 8px;
  width: 43px; /* updated dynamically via JS */
  background: ${colors.white};
  border-radius: 10px;
  transition: left ${motion.duration.fast} linear;
`;
