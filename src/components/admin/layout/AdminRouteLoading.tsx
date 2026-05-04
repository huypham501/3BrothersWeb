'use client';

import '@ant-design/v5-patch-for-react-19';
import { Card, Skeleton, Space, Spin, Typography } from 'antd';
import { AdminContent } from './AdminShell';

interface AdminRouteLoadingProps {
  tip: string;
  titleWidth?: string;
  subtitleWidth?: string;
  rows?: number;
}

export function AdminRouteLoading({
  tip,
  titleWidth = '40%',
  subtitleWidth = '70%',
  rows = 5,
}: AdminRouteLoadingProps) {
  return (
    <AdminContent>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Space align="center" size={8}>
          <Spin size="small" />
          <Typography.Text type="secondary">{tip}</Typography.Text>
        </Space>

        <Card>
          <Skeleton.Input active block style={{ width: titleWidth, marginBottom: 12 }} />
          <Skeleton.Input active block style={{ width: subtitleWidth }} />
        </Card>

        <Card>
          <Skeleton active paragraph={{ rows }} />
        </Card>
      </Space>
    </AdminContent>
  );
}
