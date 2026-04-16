'use client';

import * as React from 'react';
import { Space, Typography } from 'antd';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
  return (
    <header>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        <Typography.Text type="secondary">{description}</Typography.Text>
        {children ? <Space wrap>{children}</Space> : null}
      </Space>
    </header>
  );
}
