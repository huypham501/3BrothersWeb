import * as React from 'react';
import styled, { css } from 'styled-components';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

const BadgeRoot = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border: 1px solid transparent;

  ${({ $variant, theme }) => {
    if ($variant === 'secondary') {
      return css`
        background: ${theme.colors.secondary};
        color: ${theme.colors.textPrimary};
      `;
    }

    if ($variant === 'destructive') {
      return css`
        background: ${theme.colors.errorBg};
        color: ${theme.colors.errorText};
        border-color: ${theme.colors.errorBorder};
      `;
    }

    if ($variant === 'outline') {
      return css`
        background: transparent;
        color: ${theme.colors.textPrimary};
        border-color: ${theme.colors.borderLight};
      `;
    }

    if ($variant === 'ghost') {
      return css`
        background: ${theme.colors.gray100};
        color: ${theme.colors.textSecondary};
      `;
    }

    if ($variant === 'link') {
      return css`
        background: transparent;
        color: ${theme.colors.primary};
        padding-left: 0;
        padding-right: 0;
        text-decoration: underline;
        text-underline-offset: 3px;
      `;
    }

    return css`
      background: ${theme.colors.primary};
      color: ${theme.colors.white};
    `;
  }}
`;

const badgeVariants = {
  default: 'default',
  secondary: 'secondary',
  destructive: 'destructive',
  outline: 'outline',
  ghost: 'ghost',
  link: 'link',
} as const;

function Badge({
  variant = 'default',
  ...props
}: React.ComponentProps<'span'> & { variant?: BadgeVariant }) {
  return <BadgeRoot $variant={variant} {...props} />;
}

export { Badge, badgeVariants };
