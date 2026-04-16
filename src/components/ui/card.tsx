import * as React from 'react';
import styled from 'styled-components';

const CardRoot = styled.div<{ $size: 'default' | 'sm' }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $size, theme }) => ($size === 'sm' ? theme.spacing.sm : theme.spacing.md)};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ $size, theme }) => ($size === 'sm' ? theme.spacing.sm : theme.spacing.md)};
`;

const CardHeaderRoot = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CardTitleRoot = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardDescriptionRoot = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CardActionRoot = styled.div`
  display: inline-flex;
  align-self: flex-start;
`;

const CardContentRoot = styled.div``;

const CardFooterRoot = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.sm};
`;

function Card({
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  return <CardRoot $size={size} {...props} />;
}

function CardHeader(props: React.ComponentProps<'div'>) {
  return <CardHeaderRoot {...props} />;
}

function CardTitle(props: React.ComponentProps<'div'>) {
  return <CardTitleRoot {...props} />;
}

function CardDescription(props: React.ComponentProps<'div'>) {
  return <CardDescriptionRoot {...props} />;
}

function CardAction(props: React.ComponentProps<'div'>) {
  return <CardActionRoot {...props} />;
}

function CardContent(props: React.ComponentProps<'div'>) {
  return <CardContentRoot {...props} />;
}

function CardFooter(props: React.ComponentProps<'div'>) {
  return <CardFooterRoot {...props} />;
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
