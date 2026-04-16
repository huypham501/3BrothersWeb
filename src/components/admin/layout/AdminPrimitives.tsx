'use client';

import Link from 'next/link';
import * as React from 'react';
import { Alert, Button, Card, Tag, Typography } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';

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

interface AdminAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tone?: 'default' | 'destructive' | 'success';
  variant?: 'default' | 'destructive' | 'success';
}

interface AdminAlertTextProps {
  children: React.ReactNode;
}

interface AdminButtonProps extends Omit<AntButtonProps, 'type' | 'size' | 'href' | 'variant'> {
  children: React.ReactNode;
  href?: string;
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'sm' | 'md';
  type?: 'button' | 'submit' | 'reset';
}

export function AdminCard({ children }: AdminCardProps) {
  return <Card>{children}</Card>;
}

export function AdminCardHeader({ children }: AdminCardSectionProps) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>;
}

export function AdminCardTitle({ children }: AdminCardSectionProps) {
  return <Typography.Title level={5} style={{ margin: 0 }}>{children}</Typography.Title>;
}

export function AdminCardDescription({ children }: AdminCardSectionProps) {
  return <Typography.Text type="secondary">{children}</Typography.Text>;
}

export function AdminCardContent({ children }: AdminCardSectionProps) {
  return <div style={{ marginTop: 12 }}>{children}</div>;
}

export function AdminBadge({ children, tone = 'neutral' }: AdminBadgeProps) {
  const colorByTone: Record<NonNullable<AdminBadgeProps['tone']>, string> = {
    neutral: 'default',
    info: 'blue',
    success: 'green',
    warning: 'orange',
  };

  return <Tag color={colorByTone[tone]}>{children}</Tag>;
}

export function AdminAlert({ children, tone, variant = 'default', ...props }: AdminAlertProps) {
  const resolvedTone = tone ?? variant;
  const type = resolvedTone === 'destructive' ? 'error' : resolvedTone === 'success' ? 'success' : 'info';
  return (
    <div style={props.style} title={props.title}>
      <Alert type={type} message={children} showIcon />
    </div>
  );
}

export function AdminAlertTitle({ children }: AdminAlertTextProps) {
  return <Typography.Text strong>{children}</Typography.Text>;
}

export function AdminAlertDescription({ children }: AdminAlertTextProps) {
  return <Typography.Paragraph style={{ margin: 0 }}>{children}</Typography.Paragraph>;
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
  const antType = variant === 'outline' ? 'default' : 'primary';
  const danger = variant === 'destructive';
  const antSize = size === 'sm' ? 'small' : 'middle';

  if (href && !disabled) {
    return (
      <Link href={href} title={buttonProps.title}>
        <Button type={antType} danger={danger} size={antSize}>
          {children}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      htmlType={type === 'submit' ? 'submit' : 'button'}
      disabled={disabled}
      type={antType}
      danger={danger}
      size={antSize}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}