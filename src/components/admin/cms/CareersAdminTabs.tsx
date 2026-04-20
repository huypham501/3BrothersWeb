'use client';

import '@ant-design/v5-patch-for-react-19';
import * as React from 'react';
import { Tabs, Typography } from 'antd';
import type { CmsJobPosition, CmsPageSection } from '@/lib/cms';
import type { CareersHeroPayload } from '@/lib/cms/types/payloads';
import { CareersHeroEditor } from './editors/CareersHeroEditor';
import { JobPositionListTable } from './JobPositionListTable';

interface CareersAdminTabsProps {
  heroSection: CmsPageSection<CareersHeroPayload> | null;
  careersPageId: string | null;
  positions: CmsJobPosition[];
  role: string;
  canPublish: boolean;
}

export function CareersAdminTabs({
  heroSection,
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
  ];

  return <Tabs defaultActiveKey="positions" items={items} />;
}
