'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import { LocationIcon, ClockIcon } from './Icons';
import type { JobPosition } from '../data/jobPositions';

interface JobCardProps {
  job: JobPosition;
  variant?: 'list' | 'grid';
}

export function JobCard({ job, variant = 'list' }: JobCardProps) {
  if (variant === 'grid') {
    return (
      <GridCard>
        <CardContent>
          <HeadingBlock>
            <DeptLabel>{job.department}</DeptLabel>
            <JobTitle>{job.title}</JobTitle>
          </HeadingBlock>

          <MetaRow>
            <MetaItem>
              <ClockIcon color={colors.primary} />
              {job.type}
            </MetaItem>
            <MetaItem>
              <LocationIcon color={colors.primary} />
              {job.location}
            </MetaItem>
          </MetaRow>
        </CardContent>

        <DetailButton href={`/careers/${job.slug}`}>Xem chi tiết</DetailButton>
      </GridCard>
    );
  }

  return (
    <ListCard>
      <JobInfo>
        <JobTitle>{job.title}</JobTitle>
        <MetaRow>
          <MetaItem>
            {job.type}
          </MetaItem>
          <MetaItem>
            <LocationIcon color="rgba(6,21,48,0.6)" />
            {job.location}
          </MetaItem>
        </MetaRow>
      </JobInfo>
      <ApplyButton href={`/careers/${job.slug}`}>Ứng tuyển</ApplyButton>
    </ListCard>
  );
}

// --- Shared Styled Components ---

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

const MetaRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const MetaItem = styled.span`
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

const BaseButton = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  height: 46px;
  background: ${colors.primary};
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

// --- List Variant ---

const ListCard = styled.div`
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

const ApplyButton = styled(BaseButton)``;

// --- Grid Variant ---

const GridCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 27px 32px 28px;
  gap: 24px;
  flex: 1;
  min-width: 0;

  background: ${colors.white};
  border: 1px solid rgba(99, 149, 237, 0.1);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  transition: box-shadow ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  &:hover {
    box-shadow: 0px 6px 20px rgba(0, 60, 166, 0.12);
    transform: translateY(-2px);
  }

  ${mediaQueries.down.sm} {
    padding: 24px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

const HeadingBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  width: 100%;
`;

const DeptLabel = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.primary};
`;

const DetailButton = styled(BaseButton)``;
