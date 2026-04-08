'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

// ── Data ──────────────────────────────────────────────────────────────────────

interface JobPosition {
  id: number;
  title: string;
  type: string;
  location: string;
  applyUrl: string;
}

const INITIAL_VISIBLE = 6;

const JOB_POSITIONS: JobPosition[] = [
  { id: 1, title: 'Account Executive',    type: 'Full-time', location: 'Hồ Chí Minh', applyUrl: '/contact' },
  { id: 2, title: 'Content Creator',      type: 'Full-time', location: 'Hồ Chí Minh', applyUrl: '/contact' },
  { id: 3, title: 'KOL Specialist',       type: 'Full-time', location: 'Hồ Chí Minh', applyUrl: '/contact' },
  { id: 4, title: 'Social Media Manager', type: 'Full-time', location: 'Hồ Chí Minh', applyUrl: '/contact' },
  { id: 5, title: 'Video Editor',         type: 'Full-time', location: 'Hồ Chí Minh', applyUrl: '/contact' },
  { id: 6, title: 'Campaign Manager',     type: 'Full-time', location: 'Hồ Chí Minh', applyUrl: '/contact' },
  { id: 7, title: 'Influencer Strategist',type: 'Full-time', location: 'Hồ Chí Minh', applyUrl: '/contact' },
  { id: 8, title: 'Brand Partnership',    type: 'Full-time', location: 'Hồ Chí Minh', applyUrl: '/contact' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function CareersOpenPositionSection() {
  const [expanded, setExpanded] = useState(false);
  const visibleJobs = expanded ? JOB_POSITIONS : JOB_POSITIONS.slice(0, INITIAL_VISIBLE);

  return (
    <SectionContainer>
      {/* Background stripe overlay */}
      <StripeOverlay />

      <Inner>
        {/* Heading row */}
        <HeadingRow>
          <SectionTitle>Vị trí đang tuyển</SectionTitle>
          <OpenCount>{JOB_POSITIONS.length} vị trí đang mở</OpenCount>
        </HeadingRow>

        {/* Job list */}
        <JobList>
          {visibleJobs.map((job) => (
            <JobCard key={job.id}>
              <JobInfo>
                <JobTitle>{job.title}</JobTitle>
                <JobMeta>
                  <MetaType>{job.type}</MetaType>
                  <MetaLocation>
                    <LocationIcon />
                    {job.location}
                  </MetaLocation>
                </JobMeta>
              </JobInfo>
              <ApplyButton href={job.applyUrl}>Ứng tuyển</ApplyButton>
            </JobCard>
          ))}
        </JobList>

        {/* Xem thêm toggle */}
        {JOB_POSITIONS.length > INITIAL_VISIBLE && (
          <ShowMoreButton onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Thu gọn' : 'Xem thêm'}
            <ChevronIcon $rotated={expanded}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#061530" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ChevronIcon>
          </ShowMoreButton>
        )}
      </Inner>
    </SectionContainer>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 1.333A4.667 4.667 0 0 0 3.333 6c0 3.5 4.667 8.667 4.667 8.667S12.667 9.5 12.667 6A4.667 4.667 0 0 0 8 1.333z"
        stroke="rgba(6,21,48,0.6)"
        strokeWidth="1.167"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke="rgba(6,21,48,0.6)" strokeWidth="1.167"/>
    </svg>
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

/* Diagonal stripe overlay - matches design's "Group 11" pattern */
const StripeOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    -68deg,
    transparent 0px,
    transparent 94px,
    rgba(255, 255, 255, 0.22) 94px,
    rgba(255, 255, 255, 0.22) 134px
  );
  mix-blend-mode: overlay;
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
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

/* Individual job card — white, border, shadow, 16px radius */
const JobCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 27px 32px 28px;
  width: 100%;
  background: ${colors.white};
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  transition: box-shadow ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  &:hover {
    box-shadow: 0px 6px 20px rgba(0, 60, 166, 0.12);
    transform: translateY(-2px);
  }

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.lg};
    padding: 24px;
  }
`;

const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* Job title — 26px bold #061530 */
const JobTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.secondaryDark};
  margin: 0;

  ${mediaQueries.down.sm} {
    font-size: 20px;
  }
`;

const JobMeta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

/* "Full-time" — 16px regular 60% opacity */
const MetaType = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: rgba(6, 21, 48, 0.6);
`;

/* "📍 Hồ Chí Minh" with location pin SVG */
const MetaLocation = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: rgba(6, 21, 48, 0.6);
`;

/* "Ứng tuyển" navy pill button */
const ApplyButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  height: 46px;
  background: ${colors.primary}; /* #003CA6 */
  border-radius: 48px;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  transition: background ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.white};

  &:hover {
    background: ${colors.primaryHover};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
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
