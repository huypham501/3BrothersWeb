'use client';

import * as React from 'react';
import styled from 'styled-components';

const SeparatorRoot = styled.div<{ $orientation: 'horizontal' | 'vertical' }>`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.border};
  ${({ $orientation }) =>
    $orientation === 'horizontal'
      ? 'width: 100%; height: 1px;'
      : 'width: 1px; align-self: stretch;'}
`;

function Separator({
  orientation = 'horizontal',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <SeparatorRoot
      role="separator"
      aria-orientation={orientation}
      $orientation={orientation}
      {...props}
    />
  );
}

export { Separator };
