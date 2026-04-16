'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import { JOB_POSITIONS, type JobPosition } from '../../careers/data/jobPositions';
import { JobCard } from '../../careers/shared/JobCard';

// ── Props ─────────────────────────────────────────────────────────────────────

interface CareerDetailExploreSectionProps {
  currentSlug: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CareerDetailExploreSection({ currentSlug }: CareerDetailExploreSectionProps) {
  // Pick up to 3 other jobs, excluding the current one
  const relatedJobs = JOB_POSITIONS
    .filter((job) => job.slug !== currentSlug)
    .slice(0, 3);

  if (relatedJobs.length === 0) return null;

  return (
    <SectionContainer>
      <Inner>
        <SectionTitle>CÓ THỂ BẠN CŨNG QUAN TÂM</SectionTitle>

        <CardGrid>
          {relatedJobs.map((job) => (
            <JobCard key={job.id} job={job} variant="grid" />
          ))}
        </CardGrid>
      </Inner>
    </SectionContainer>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  width: 100%;
  padding: 0 0 100px;

  ${mediaQueries.down.lg} {
    padding: 0 0 80px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 0 60px;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  ${mediaQueries.down.lg} {
    padding: 0 ${spacing.xl};
  }

  ${mediaQueries.down.sm} {
    padding: 0 ${spacing.lg};
    gap: 24px;
  }
`;

/* "CÓ THỂ BẠN CŨNG QUAN TÂM" — 26px bold uppercase #181A2A */
const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  text-transform: uppercase;
  color: #181A2A;
  margin: 0;
  width: 100%;

  ${mediaQueries.down.sm} {
    font-size: 20px;
  }
`;

/* 3-column grid of cards */
const CardGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  width: 100%;

  ${mediaQueries.down.lg} {
    flex-direction: column;
    gap: 16px;
  }
`;
