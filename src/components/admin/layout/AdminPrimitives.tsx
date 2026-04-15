import Link from 'next/link';
import * as React from 'react';
import styled, { css } from 'styled-components';

interface AdminCardProps {
  children: React.ReactNode;
}

interface AdminCardSectionProps {
  children: React.ReactNode;
}

interface AdminBadgeProps {
  children: React.ReactNode;
  tone?: 'neutral' | 'info' | 'success' | 'warning';
}

interface AdminAlertProps {
  children: React.ReactNode;
  tone?: 'default' | 'destructive' | 'success';
  variant?: 'default' | 'destructive' | 'success';
}

interface AdminAlertTextProps {
  children: React.ReactNode;
}

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'sm' | 'md';
}

export function AdminCard({ children }: AdminCardProps) {
  return <Card>{children}</Card>;
}

export function AdminCardHeader({ children }: AdminCardSectionProps) {
  return <CardHeader>{children}</CardHeader>;
}

export function AdminCardTitle({ children }: AdminCardSectionProps) {
  return <CardTitle>{children}</CardTitle>;
}

export function AdminCardDescription({ children }: AdminCardSectionProps) {
  return <CardDescription>{children}</CardDescription>;
}

export function AdminCardContent({ children }: AdminCardSectionProps) {
  return <CardContent>{children}</CardContent>;
}

export function AdminBadge({ children, tone = 'neutral' }: AdminBadgeProps) {
  return <Badge $tone={tone}>{children}</Badge>;
}

export function AdminAlert({ children, tone, variant = 'default' }: AdminAlertProps) {
  const resolvedTone = tone ?? variant;
  return <AlertBox $tone={resolvedTone}>{children}</AlertBox>;
}

export function AdminAlertTitle({ children }: AdminAlertTextProps) {
  return <AlertTitle>{children}</AlertTitle>;
}

export function AdminAlertDescription({ children }: AdminAlertTextProps) {
  return <AlertDescription>{children}</AlertDescription>;
}

export function AdminButton({
  children,
  href,
  disabled,
  variant = 'default',
  size = 'md',
  type,
  ...buttonProps
}: AdminButtonProps) {
  if (href && !disabled) {
    return (
      <ButtonLink href={href} $variant={variant} $size={size} title={buttonProps.title}>
        {children}
      </ButtonLink>
    );
  }

  return (
    <Button
      type={type ?? 'button'}
      disabled={disabled}
      $variant={variant}
      $size={size}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

const Card = styled.section`
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
`;

const CardDescription = styled.p`
  margin: 8px 0 0;
  font-size: 0.875rem;
  color: #64748b;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const Badge = styled.span<{ $tone: 'neutral' | 'info' | 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  border: 1px solid
    ${({ $tone }) => {
      if ($tone === 'success') return '#16a34a';
      if ($tone === 'warning') return '#ca8a04';
      if ($tone === 'info') return '#0f172a';
      return '#cbd5e1';
    }};
  border-radius: 9999px;
  background: ${({ $tone }) => ($tone === 'neutral' ? '#ffffff' : '#f8fafc')};
  color: ${({ $tone }) => ($tone === 'warning' ? '#854d0e' : '#334155')};
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const AlertBox = styled.div<{ $tone: 'default' | 'destructive' | 'success' }>`
  border: 1px solid
    ${({ $tone }) => {
      if ($tone === 'destructive') return '#fecaca';
      if ($tone === 'success') return '#86efac';
      return '#cbd5e1';
    }};
  background: ${({ $tone }) => ($tone === 'destructive' ? '#fff1f2' : $tone === 'success' ? '#f0fdf4' : '#ffffff')};
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AlertTitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
`;

const AlertDescription = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #475569;
`;

const buttonBase = css<{ $variant: 'default' | 'outline' | 'destructive'; $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;

  ${({ $size }) =>
    $size === 'sm'
      ? css`
          height: 32px;
          padding: 0 12px;
          font-size: 0.8125rem;
        `
      : css`
          height: 36px;
          padding: 0 14px;
          font-size: 0.875rem;
        `};

  ${({ $variant }) =>
    $variant === 'outline'
      ? css`
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;

          &:hover {
            background: #f8fafc;
          }
        `
      : $variant === 'destructive'
      ? css`
          background: #dc2626;
          border: 1px solid #dc2626;
          color: #ffffff;

          &:hover {
            background: #b91c1c;
          }
        `
      : css`
          background: #0f172a;
          border: 1px solid #0f172a;
          color: #ffffff;

          &:hover {
            background: #1e293b;
          }
        `};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Button = styled.button<{ $variant: 'default' | 'outline' | 'destructive'; $size: 'sm' | 'md' }>`
  ${buttonBase}
`;

const ButtonLink = styled(Link)<{ $variant: 'default' | 'outline' | 'destructive'; $size: 'sm' | 'md' }>`
  ${buttonBase}
`;
