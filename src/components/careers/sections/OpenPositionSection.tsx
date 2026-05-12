'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import { JOB_POSITIONS, type JobPosition } from '../data/jobPositions';
import { JobCard } from '../shared/JobCard';
const CONTACT_CTA_BG_IMAGE = '/images/careers/open-position-bg.png';
const CONTACT_CTA_BG_ASPECT_RATIO = '1440 / 1043';
const CONTACT_CTA_BG_WIDTH = '1440px';

// ── Props / Data ───────────────────────────────────────────────────────────────

const INITIAL_VISIBLE = 6;

interface OpenPositionSectionProps {
  /** Live CMS positions. Falls back to hardcoded JOB_POSITIONS if omitted. */
  positions?: JobPosition[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export function OpenPositionSection({ positions }: OpenPositionSectionProps) {
  const allJobs = positions ?? JOB_POSITIONS;
  const [expanded, setExpanded] = useState(false);
  const visibleJobs = expanded ? allJobs : allJobs.slice(0, INITIAL_VISIBLE);

  return (
    <SectionContainer>
      <BackgroundLayer aria-hidden="true" />

      <Inner>
        {/* Heading row */}
        <HeadingRow>
          <SectionTitle>Vị trí đang tuyển</SectionTitle>
          <OpenCount>{allJobs.length} vị trí đang mở</OpenCount>
        </HeadingRow>

        {/* Job list */}
        <JobList>
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} variant="list" />
          ))}
        </JobList>

        {/* Xem thêm toggle */}
        {allJobs.length > INITIAL_VISIBLE && (
          <ShowMoreButton onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Thu gọn' : 'Xem thêm'}
            <ChevronIcon $rotated={expanded}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#061530" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ChevronIcon>
          </ShowMoreButton>
        )}
      </Inner>
    </SectionContainer>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  position: relative;
  width: 100%;
  background: #B4CFFF;
  overflow: hidden;
  padding: 80px 0 100px;

  ${mediaQueries.down.lg} {
    padding: 60px 0 80px;
  }

  ${mediaQueries.down.sm} {
    padding: 48px 0 60px;
  }
`;

const BackgroundLayer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  width: ${CONTACT_CTA_BG_WIDTH};
  height: auto;
  aspect-ratio: ${CONTACT_CTA_BG_ASPECT_RATIO};
  transform: translateX(-50%);
  background-image: url('${CONTACT_CTA_BG_IMAGE}');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;
  -webkit-mask-image:
    linear-gradient(to right, transparent 0%, white 20%, white 80%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, white 12%, white 100%);
  mask-image:
    linear-gradient(to right, transparent 0%, white 20%, white 80%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, white 12%, white 100%);
  -webkit-mask-repeat: no-repeat, no-repeat;
  mask-repeat: no-repeat, no-repeat;
  -webkit-mask-size: 100% 100%, 100% 100%;
  mask-size: 100% 100%, 100% 100%;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
  pointer-events: none;
  z-index: 0;

  ${mediaQueries.down.sm} {
    background-position: center -40px;
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 792px;
  margin: 0 auto;
  padding: 0 ${spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;

  ${mediaQueries.down.sm} {
    padding: 0 ${spacing.lg};
    gap: 32px;
  }
`;

/* Heading row: title left, count right */
const HeadingRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`;

/* "Vị trí đang tuyển" — 42px cobalt bold */
const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['6xl']}; /* 42px */
  line-height: 140%;
  color: ${colors.primary}; /* #003CA6 */
  margin: 0;

  ${mediaQueries.down.lg} {
    font-size: 32px;
  }

  ${mediaQueries.down.sm} {
    font-size: 24px;
  }
`;

/* "6 vị trí đang mở" — 16px regular dark */
const OpenCount = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.secondaryDark};
  white-space: nowrap;
  padding-bottom: 6px;

  ${mediaQueries.down.sm} {
    font-size: 12px;
  }
`;

/* Vertical list of job cards */
const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

/* "Xem thêm" outline pill */
const ShowMoreButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  height: 50px;
  background: transparent;
  border: 1px solid ${colors.secondaryDark};
  border-radius: 48px;
  cursor: pointer;
  transition: background ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.secondaryDark};

  &:hover {
    background: rgba(6, 21, 48, 0.05);
    transform: translateY(-1px);
  }
`;

const ChevronIcon = styled.span<{ $rotated: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform ${motion.duration.slow} ease;
  transform: ${({ $rotated }) => ($rotated ? 'rotate(180deg)' : 'rotate(0deg)')};
`;
