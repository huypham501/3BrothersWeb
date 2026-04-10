'use client';

import * as React from 'react';
import styled from 'styled-components';

const CardRoot = styled.div`
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.borderInput || '#e2e8f0'};
  background-color: #ffffff;
  color: #020817;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  margin-bottom: 24px;
`;

const CardHeaderRoot = styled.div`
  display: flex;
  flex-direction: column;
  space-y: 1.5;
  padding: 1.5rem;
`;

const CardTitleRoot = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.05em;
  margin: 0;
`;

const CardDescriptionRoot = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.375rem 0 0 0;
`;

const CardContentRoot = styled.div`
  padding: 1.5rem;
  padding-top: 0;
`;

const CardFooterRoot = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  padding-top: 0;
`;

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <CardRoot ref={ref} className={className} {...props} />
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <CardHeaderRoot ref={ref} className={className} {...props} />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <CardTitleRoot ref={ref} className={className} {...props} />
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <CardDescriptionRoot ref={ref} className={className} {...props} />
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <CardContentRoot ref={ref} className={className} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <CardFooterRoot ref={ref} className={className} {...props} />
);
CardFooter.displayName = "CardFooter";
