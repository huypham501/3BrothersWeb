'use client';

import * as React from 'react';
import styled, { css } from 'styled-components';

const alertVariants = {
  default: css`
    background-color: #ffffff;
    color: #020817;
    border-color: #e2e8f0;
  `,
  destructive: css`
    border-color: #f87171;
    color: #ef4444;
  `,
  success: css`
    border-color: #4ade80;
    color: #22c55e;
  `
};

const AlertRoot = styled.div<{ $variant: keyof typeof alertVariants }>`
  position: relative;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid;
  padding: 1rem;
  font-size: 0.875rem;

  ${({ $variant }) => alertVariants[$variant]}
`;

const AlertTitleRoot = styled.h5`
  margin-bottom: 0.25rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.05em;
  margin-top: 0;
`;

const AlertDescriptionRoot = styled.div`
  font-size: 0.875rem;
  line-height: 1.625;
  opacity: 0.9;
`;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <AlertRoot ref={ref} className={className} $variant={variant} {...props} />
  )
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <AlertTitleRoot ref={ref} className={className} {...props} />
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <AlertDescriptionRoot ref={ref} className={className} {...props} />
);
AlertDescription.displayName = "AlertDescription";
