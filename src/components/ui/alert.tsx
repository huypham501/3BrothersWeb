import * as React from 'react';
import styled, { css } from 'styled-components';

type AlertVariant = 'default' | 'destructive' | 'success';

const AlertRoot = styled.div<{ $variant: AlertVariant }>`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};

  ${({ $variant, theme }) => {
    if ($variant === 'destructive') {
      return css`
        background: ${theme.colors.errorBg};
        border-color: ${theme.colors.errorBorder};
        color: ${theme.colors.errorText};
      `;
    }

    if ($variant === 'success') {
      return css`
        background: ${theme.colors.successBg};
        border-color: ${theme.colors.successBorder};
        color: ${theme.colors.successText};
      `;
    }

    return css`
      background: ${theme.colors.white};
      color: ${theme.colors.textPrimary};
    `;
  }}
`;

const AlertTitleRoot = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const AlertDescriptionRoot = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const AlertActionRoot = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[2]};
  right: ${({ theme }) => theme.spacing[2]};
`;

function Alert({
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & { variant?: AlertVariant }) {
  return <AlertRoot role="alert" $variant={variant} {...props} />;
}

function AlertTitle(props: React.ComponentProps<'div'>) {
  return <AlertTitleRoot {...props} />;
}

function AlertDescription(props: React.ComponentProps<'div'>) {
  return <AlertDescriptionRoot {...props} />;
}

function AlertAction(props: React.ComponentProps<'div'>) {
  return <AlertActionRoot {...props} />;
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
