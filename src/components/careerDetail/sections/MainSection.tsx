'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';
import { SITE_URL } from '@/lib/constants';
import type { JobPosition } from '../../careers/data/jobPositions';
import type { CareersSocialSharePayload } from '@/lib/cms/types';
import Link from 'next/link';
import {
  DepartmentIcon,
  TypeIcon,
  LocationIcon,
  ExperienceIcon,
  SalaryIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
} from '../../careers/shared/Icons';

// ── Props ─────────────────────────────────────────────────────────────────────

interface CareerDetailMainSectionProps {
  job: JobPosition;
  socialShare?: CareersSocialSharePayload | null;
}

const DEFAULT_SOCIAL_SHARE: CareersSocialSharePayload = {
  enabled: true,
  share_label: 'Chia sẻ vị trí này',
  platforms: [
    { id: 'facebook', label: 'Facebook', enabled: true, url_template: 'https://www.facebook.com/sharer/sharer.php?u={url}' },
    { id: 'twitter', label: 'Twitter', enabled: true, url_template: 'https://twitter.com/intent/tweet?url={url}&text={title}' },
    { id: 'instagram', label: 'Instagram', enabled: true, url_template: '' },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

export function MainSection({ job, socialShare }: CareerDetailMainSectionProps) {
  const shareConfig = socialShare ?? DEFAULT_SOCIAL_SHARE;
  const shareLinks = shareConfig.platforms.filter((platform) => platform.enabled);

  return (
    <Container>
      <Inner>
        {/* Left column: Paragraphs */}
        <ParagraphsColumn>
          <ParagraphGroup title="Mô tả công việc" items={job.descriptions} />
          <ParagraphGroup title="Yêu cầu ứng viên" items={job.requirements} />
          <ParagraphGroup title="Quyền lợi" items={job.benefits} />
        </ParagraphsColumn>

        {/* Right column: Sticky Overview Card */}
        <SidebarColumn>
          <OverviewCard>
            <CardTitle>Thông tin vị trí</CardTitle>

            <CardInfoList>
              <InfoItem icon={<DepartmentIcon color={colors.primary} />} label="Phòng ban" value={job.department} />
              <InfoItem icon={<TypeIcon color={colors.primary} />} label="Loại hình" value={job.type} />
              <InfoItem icon={<LocationIcon color={colors.primary} size={24} />} label="Địa điểm" value={job.location} />
              <InfoItem icon={<ExperienceIcon color={colors.primary} />} label="Kinh nghiệm" value={job.experience} />
              <InfoItem icon={<SalaryIcon color={colors.primary} />} label="Mức lương" value={job.salary} />
            </CardInfoList>

            <ApplyButton href="/contact">Ứng tuyển ngay</ApplyButton>

            {shareConfig.enabled && shareLinks.length > 0 && (
              <ShareSection>
                <ShareLabel>{shareConfig.share_label}</ShareLabel>
                <SocialRow>
                  {shareLinks.map((platform) => (
                    <SocialBtn
                      key={platform.id}
                      href={buildShareHref(platform, job)}
                      aria-label={platform.label}
                      target={platform.url_template ? '_blank' : undefined}
                      rel={platform.url_template ? 'noopener noreferrer' : undefined}
                    >
                      {renderSocialIcon(platform.id)}
                    </SocialBtn>
                  ))}
                </SocialRow>
              </ShareSection>
            )}
          </OverviewCard>
        </SidebarColumn>
      </Inner>
    </Container>
  );
}

function buildShareHref(
  platform: CareersSocialSharePayload['platforms'][number],
  job: JobPosition
) {
  const pageUrl = `${SITE_URL}/careers/${job.slug}`;
  const template = platform.url_template.trim();

  if (template) {
    return template
      .replaceAll('{url}', encodeURIComponent(pageUrl))
      .replaceAll('{title}', encodeURIComponent(job.title));
  }

  if (platform.id === 'facebook') {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  }

  if (platform.id === 'twitter') {
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(job.title)}`;
  }

  return '#';
}

function renderSocialIcon(platformId: CareersSocialSharePayload['platforms'][number]['id']) {
  if (platformId === 'facebook') return <FacebookIcon color={colors.primary} />;
  if (platformId === 'twitter') return <TwitterIcon color={colors.primary} />;
  return <InstagramIcon color={colors.primary} />;
}

// ── Helper Subcomponents ──────────────────────────────────────────────────────

function ParagraphGroup({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <GroupContainer>
      <GroupTitle>{title}</GroupTitle>
      <GroupContent>
        {items.map((item, idx) => (
          <BulletItem key={idx}>- {item}</BulletItem>
        ))}
      </GroupContent>
    </GroupContainer>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <InfoRow>
      <IconWrapper>{icon}</IconWrapper>
      <InfoText>
        <InfoLabel>{label}</InfoLabel>
        <InfoValue>{value}</InfoValue>
      </InfoText>
    </InfoRow>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

const Container = styled.section`
  width: 100%;
  padding: 120px 0;
  position: relative;
  z-index: 2;

  ${mediaQueries.down.lg} {
    padding: 80px 0;
  }

  ${mediaQueries.down.sm} {
    padding: 60px 0;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 80px;

  ${mediaQueries.down.xl} {
    flex-direction: column;
    padding: 0 ${spacing.xl};
    gap: 48px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 ${spacing.lg};
    gap: 32px;
  }
`;

// --- Left Column (Paragraphs) ---

const ParagraphsColumn = styled.div`
  flex: 1;
  max-width: 795px;
  display: flex;
  flex-direction: column;
  gap: 40px; /* From design */
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GroupTitle = styled.h2`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.primary}; /* #003CA6 */
  margin: 0;

  ${mediaQueries.down.sm} {
    font-size: 22px;
  }
`;

const GroupContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; /* Slightly tighter than 16px for bullet points */
`;

const BulletItem = styled.p`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: 18px;
  line-height: 150%;
  color: #000000;
  margin: 0;

  ${mediaQueries.down.sm} {
    font-size: 16px;
  }
`;

// --- Right Column (Overview Card) ---

const SidebarColumn = styled.div`
  width: 405px;
  flex-shrink: 0;

  /* Sticky positioning */
  position: sticky;
  top: 140px; /* Offset for fixed header */

  ${mediaQueries.down.xl} {
    width: 100%;
    max-width: 600px;
    position: relative;
    top: 0;
  }
`;

const OverviewCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px;
  gap: 16px;
  background: ${colors.white};
  box-shadow: 0px 4px 24px rgba(6, 21, 48, 0.2);
  border-radius: 24px;
  width: 100%;

  ${mediaQueries.down.sm} {
    padding: 24px;
  }
`;

const CardTitle = styled.h3`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.primary};
  margin: 0 0 16px 0;
  width: 100%;

  ${mediaQueries.down.sm} {
    font-size: 22px;
  }
`;

const CardInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: rgba(6, 21, 48, 0.6);
`;

const InfoValue = styled.span`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: 140%;
  color: ${colors.secondaryDark}; /* #061530 */
`;

const ApplyButton = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 32px;
  gap: 12px;
  width: 100%;
  height: 46px;
  background: ${colors.primary};
  border-radius: 48px;
  text-decoration: none;
  transition: background ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
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

const ShareSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  gap: 12px;
  width: 100%;
`;

const ShareLabel = styled.span`
  font-family: ${typography.fontFamily.montserrat};
  font-weight: 600;
  font-size: 16px;
  line-height: 140%;
  color: ${colors.secondaryDark};
`;

const SocialRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const SocialBtn = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  background: rgba(180, 207, 255, 0.2);
  border-radius: 6px;
  transition: background ${motion.duration.base} ease;

  &:hover {
    background: rgba(180, 207, 255, 0.4);
  }
`;
