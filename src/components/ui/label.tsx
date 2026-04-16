'use client';

import * as React from 'react';
import styled from 'styled-components';

const LabelRoot = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

function Label(props: React.ComponentProps<'label'>) {
  return <LabelRoot {...props} />;
}

export { Label };
