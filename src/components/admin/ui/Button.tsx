'use client';

import * as React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const buttonVariants = {
  default: css`
    background-color: #003CA6; /* primary */
    color: #ffffff;
    &:hover { background-color: #002f7d; }
  `,
  destructive: css`
    background-color: #ef4444;
    color: #ffffff;
    &:hover { background-color: #dc2626; }
  `,
  outline: css`
    border: 1px solid #e2e8f0;
    background-color: transparent;
    color: #020817;
    &:hover { background-color: #f1f5f9; }
  `,
  secondary: css`
    background-color: #f1f5f9;
    color: #0f172a;
    &:hover { background-color: #e2e8f0; }
  `,
  ghost: css`
    background-color: transparent;
    color: #020817;
    &:hover { background-color: #f1f5f9; }
  `,
  link: css`
    background-color: transparent;
    color: #003CA6;
    text-decoration-line: underline;
    text-underline-offset: 4px;
    padding: 0;
    height: auto;
  `
};

const buttonSizes = {
  default: css`
    height: 2.5rem;
    padding: 0.5rem 1rem;
  `,
  sm: css`
    height: 2.25rem;
    border-radius: 0.375rem;
    padding: 0 0.75rem;
  `,
  lg: css`
    height: 2.75rem;
    border-radius: 0.375rem;
    padding: 0 2rem;
  `,
  icon: css`
    height: 2.5rem;
    width: 2.5rem;
  `
};

const ButtonRoot = styled.button<{ $variant: keyof typeof buttonVariants; $size: keyof typeof buttonSizes }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: colors 0.15s;
  border: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #003CA6;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  ${({ $variant }) => buttonVariants[$variant]}
  ${({ $size }) => buttonSizes[$size]}
`;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <ButtonRoot ref={ref} $variant={variant} $size={size} className={className} {...props} />
    );
  }
);
Button.displayName = "Button";
