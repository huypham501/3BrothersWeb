import * as React from 'react';
import styled from 'styled-components';

interface AdminShellProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function AdminShell({ children, maxWidth = '1120px' }: AdminShellProps) {
  return (
    <Root>
      <Container style={{ maxWidth }}>{children}</Container>
    </Root>
  );
}

const Root = styled.main`
  min-height: 100vh;
  background: #f1f5f9;
  padding: 32px;
`;

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
