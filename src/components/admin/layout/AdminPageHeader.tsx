import * as React from 'react';
import styled from 'styled-components';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
  return (
    <Header>
      <Heading>{title}</Heading>
      <Description>{description}</Description>
      {children ? <MetaRow>{children}</MetaRow> : null}
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;
