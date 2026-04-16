'use client';

import '@ant-design/v5-patch-for-react-19';
import * as React from 'react';
import { Layout } from 'antd';

interface AdminShellProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function AdminShell({ children, maxWidth = '1120px' }: AdminShellProps) {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5', padding: 24 }}>
      <div style={{ margin: '0 auto', maxWidth, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {children}
      </div>
    </Layout>
  );
}
