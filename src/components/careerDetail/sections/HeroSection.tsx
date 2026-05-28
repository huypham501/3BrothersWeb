'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import type { JobPosition } from '../../careers/data/jobPositions';
import { ClockIcon, LocationIcon, CalendarIcon, ArrowIcon } from '../../careers/shared/Icons';

const HERO_BG_IMAGE = '/images/careers/hero-background.png';
const HERO_BG_ASPECT_RATIO = '1440 / 521';
const HERO_BG_WIDTH = '1440px';

// ── Props ─────────────────────────────────────────────────────────────────────

interface CareerDetailHeroSectionProps {
  job: JobPosition;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HeroSection({ job }: CareerDetailHeroSectionProps) {
  const postedLabel =
    job.postedDaysAgo === 0
      ? 'Đăng hôm nay'
      : `Đăng ${job.postedDaysAgo} ngày trước`;

  return (
    <HeroContainer>
      <BackgroundLayer aria-hidden="true" />

      <Inner>
        {/* Breadcrumb: "Tuyển dụng / Creative" */}
        <Breadcrumb>
          <BreadcrumbLink href="/careers">Tuyển dụng</BreadcrumbLink>
          <BreadcrumbSep>/</BreadcrumbSep>
          <BreadcrumbCurrent>{job.department}</BreadcrumbCurrent>
        </Breadcrumb>

        {/* Job title — 68px bold white */}
        <JobTitle>{job.title}</JobTitle>

        {/* Meta row + Apply button */}
        <MetaBlock>
          {/* Short description */}
          <ShortDesc>{job.shortDescription}</ShortDesc>

          {/* Meta row: type · location · posted */}
          <MetaRow>
            <MetaItem>
              <ClockIcon color="#F0F4FF" />
              {job.type}
            </MetaItem>
            <MetaItem>
              <LocationIcon color="#F0F4FF" />
              {job.location}
            </MetaItem>
            <MetaItem>
              <CalendarIcon color="#F0F4FF" />
              {postedLabel}
            </MetaItem>
          </MetaRow>

          {/* CTA — yellow pill */}
          <ApplyButton href="/contact">
            Ứng tuyển
            <ArrowIcon color={colors.secondaryDark} />
          </ApplyButton>
        </MetaBlock>
      </Inner>
    </HeroContainer>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

// ── Styled components ─────────────────────────────────────────────────────────

const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 521px;
  background: #6395ED;
  overflow: hidden;
  display: flex;
  align-items: flex-end;

  ${mediaQueries.down.lg} {
    min-height: 420px;
  }

  ${mediaQueries.down.sm} {
    min-height: 380px;
  }
`;

const BackgroundLayer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  width: ${HERO_BG_WIDTH};
  height: auto;
  aspect-ratio: ${HERO_BG_ASPECT_RATIO};
  transform: translateX(-50%);
  background-image: url('${HERO_BG_IMAGE}');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;
  -webkit-mask-image:
    linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, black 12%, black 100%);
  mask-image:
    linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, black 12%, black 100%);
  -webkit-mask-repeat: no-repeat, no-repeat;
  mask-repeat: no-repeat, no-repeat;
  -webkit-mask-size: 100% 100%, 100% 100%;
  mask-size: 100% 100%, 100% 100%;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
  pointer-events: none;
  z-index: 0;

  ${mediaQueries.down.sm} {
    background-position: center -20px;
  }
`;

/* Inner content area — 170px top padding, 84px sides, 80px bottom  */
const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 168px 84px 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;

  ${mediaQueries.down.lg} {
    padding: 140px ${spacing.xl} 60px;
  }

  ${mediaQueries.down.sm} {
    padding: 120px ${spacing.lg} 48px;
  }
`;

/* "Tuyển dụng / Creative" breadcrumb */
const Breadcrumb = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const BreadcrumbLink = styled(Link)`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color ${motion.duration.base} ease;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const BreadcrumbSep = styled.span`
  font-family: ${typography.fontFamily.montserrat};
  font-size: ${typography.fontSize.md};
  color: rgba(255, 255, 255, 0.5);
`;

const BreadcrumbCurrent = styled.span`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: 600;
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: #ffffff;
`;

/* Job title — 68px bold white */
const JobTitle = styled.h1`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 68px;
  line-height: 140%;
  color: #ffffff;
  margin: 0 0 0 0;

  ${mediaQueries.down.lg} {
    font-size: 48px;
  }

  ${mediaQueries.down.sm} {
    font-size: 36px;
  }
`;

/* Container for description + meta + button — 16px top padding, 16px gap */
const MetaBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 16px;
  gap: 16px;
`;

/* Short description — 16px regular white */
const ShortDesc = styled.p`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: #ffffff;
  margin: 0;
  max-width: 579px;
`;

/* Meta row — Full-time · 📍 Hồ Chí Minh · 📅 Đăng 5 ngày trước */
const MetaRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;

  ${mediaQueries.down.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const MetaItem = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: #F0F4FF;
`;

/* Yellow "Ứng tuyển →" pill button */
const ApplyButton = styled(Link)`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 32px;
  height: 46px;
  background: #FFE773;
  box-shadow: 0px 4px 4px -1px rgba(12, 12, 13, 0.1), 0px 4px 4px -1px rgba(12, 12, 13, 0.05);
  border-radius: 48px;
  text-decoration: none;
  cursor: pointer;
  transition: transform ${motion.duration.base} ease, box-shadow ${motion.duration.base} ease;

  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.secondaryDark}; /* #061530 */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 16px -2px rgba(12, 12, 13, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;
