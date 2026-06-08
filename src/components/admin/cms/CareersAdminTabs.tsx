'use client';

import '@ant-design/v5-patch-for-react-19';
import * as React from 'react';
import { Tabs, Typography } from 'antd';
import type { CmsJobPosition, CmsPageSection } from '@/lib/cms';
import type { CareersHeroPayload, CareersSocialSharePayload } from '@/lib/cms/types/payloads';
import { CareersHeroEditor } from './editors/CareersHeroEditor';
import { CareersSocialShareEditor } from './editors/CareersSocialShareEditor';
import { JobPositionListTable } from './JobPositionListTable';

interface CareersAdminTabsProps {
  heroSection: CmsPageSection<CareersHeroPayload> | null;
  socialShareSection: CmsPageSection<CareersSocialSharePayload> | null;
  careersPageId: string | null;
  positions: CmsJobPosition[];
  role: string;
  canPublish: boolean;
}

export function CareersAdminTabs({
  heroSection,
  socialShareSection,
  careersPageId,
  positions,
  role,
  canPublish,
}: CareersAdminTabsProps) {
  const items = [
    {
      key: 'positions',
      label: 'Job Positions',
      children: <JobPositionListTable positions={positions} />,
    },
    {
      key: 'hero',
      label: 'Hero Section',
      children:
        heroSection && careersPageId ? (
          <CareersHeroEditor
            pageId={careersPageId}
            section={heroSection}
            role={role}
            canPublish={canPublish}
          />
        ) : (
          <Typography.Text type="secondary">
            Hero section not found in database. Please run the careers migration.
          </Typography.Text>
        ),
    },
    {
      key: 'social-share',
      label: 'Social Share',
      children:
        socialShareSection && careersPageId ? (
          <CareersSocialShareEditor
            pageId={careersPageId}
            section={socialShareSection}
            role={role}
            canPublish={canPublish}
          />
        ) : (
          <Typography.Text type="secondary">
            Social share section not found in database. Please run the careers social share migration.
          </Typography.Text>
        ),
    },
  ];

  return <Tabs defaultActiveKey="positions" items={items} />;
}
