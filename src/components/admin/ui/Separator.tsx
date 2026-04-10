'use client';

import * as React from 'react';
import styled from 'styled-components';

const SeparatorRoot = styled.div<{ $orientation: 'horizontal' | 'vertical' }>`
  background-color: #e2e8f0;
  flex-shrink: 0;
  ${({ $orientation }) =>
    $orientation === 'horizontal'
      ? `
    height: 1px;
    width: 100%;
  `
      : `
    height: 100%;
    width: 1px;
  `}
`;

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <SeparatorRoot ref={ref} className={className} $orientation={orientation} {...props} />
  )
);
Separator.displayName = "Separator";
