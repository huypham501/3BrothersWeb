import * as React from 'react';
import styled, { css } from 'styled-components';

type UiVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'gradient'
  | 'outlineLight';
type UiSize = 'default' | 'sm' | 'lg' | 'icon' | 'xl';

type StyledButtonProps = {
  $variant: UiVariant;
  $size: UiSize;
  $rounded: boolean;
  $fullWidth: boolean;
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: UiVariant;
  size?: UiSize;
  asChild?: boolean;
  as?: React.ElementType;
  href?: string;
  $variant?: UiVariant;
  $size?: UiSize;
  $rounded?: boolean;
  $fullWidth?: boolean;
};

const buttonVariantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
      border-color: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  destructive: css`
    background: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.error};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.borderLight};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.primary};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.secondary};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.primary};
    }
  `,
  link: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 0;
    text-decoration: underline;
    text-underline-offset: 4px;
    padding-left: 0;
    padding-right: 0;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  gradient: css`
    background: linear-gradient(
      89.97deg,
      ${({ theme }) => theme.colors.primary} 0.02%,
      ${({ theme }) => theme.colors.primaryLight} 138.52%
    );
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      opacity: 0.92;
    }
  `,
  outlineLight: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid rgba(255, 255, 255, 0.6);

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
  `,
} as const;

const buttonSizeStyles = {
  default: css`
    min-height: 42px;
    padding: 10px 16px;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
  sm: css`
    min-height: 34px;
    padding: 8px 12px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  lg: css`
    min-height: 46px;
    padding: 12px 24px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  `,
  icon: css`
    width: 42px;
    height: 42px;
    padding: 0;
  `,
  xl: css`
    min-height: 54px;
    padding: 14px 32px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  `,
} as const;

const ButtonRoot = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  border-radius: ${({ $rounded, theme }) => ($rounded ? theme.borderRadius.round : theme.borderRadius.md)};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  transition:
    background-color ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut},
    border-color ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut},
    color ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut},
    opacity ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut},
    transform ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut};
  cursor: pointer;

  ${({ $variant }) => buttonVariantStyles[$variant]}
  ${({ $size }) => buttonSizeStyles[$size]}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const mergeClassNames = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(' ');

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      asChild = false,
      as,
      $variant,
      $size,
      $rounded = false,
      $fullWidth = false,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = variant ?? $variant ?? 'default';
    const resolvedSize = size ?? $size ?? 'default';

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<Record<string, unknown>>;
      return (
        <ButtonRoot
          as={child.type as React.ElementType}
          ref={ref as React.Ref<HTMLButtonElement>}
          className={mergeClassNames(child.props.className as string | undefined, className)}
          $variant={resolvedVariant}
          $size={resolvedSize}
          $rounded={$rounded}
          $fullWidth={$fullWidth}
          {...child.props}
          {...props}
        />
      );
    }

    const Comp: React.ElementType = as ?? 'button';
    const buttonProps: Record<string, unknown> = { ...props };

    if (!as && !('type' in buttonProps)) {
      buttonProps.type = 'button';
    }

    return (
      <ButtonRoot
        as={Comp}
        ref={ref as React.Ref<HTMLButtonElement>}
        className={className}
        $variant={resolvedVariant}
        $size={resolvedSize}
        $rounded={$rounded}
        $fullWidth={$fullWidth}
        {...buttonProps}
      >
        {children}
      </ButtonRoot>
    );
  }
);

Button.displayName = 'Button';

export { Button };
