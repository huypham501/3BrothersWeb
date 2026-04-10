'use client';

import * as React from 'react';
import styled from 'styled-components';

const SwitchRoot = styled.button<{ $checked: boolean }>`
  width: 44px;
  height: 24px;
  background-color: ${({ $checked, theme }) => ($checked ? theme.colors.primary || '#003CA6' : '#e2e8f0')};
  border-radius: 9999px;
  border: 2px solid transparent;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 0;

  &:focus-visible {
    outline: 2px solid #003CA6;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SwitchThumb = styled.span<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
  transform: ${({ $checked }) => ($checked ? 'translateX(20px)' : 'translateX(0)')};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => {
    return (
      <SwitchRoot
        type="button"
        role="switch"
        aria-checked={checked}
        ref={ref}
        $checked={checked}
        className={className}
        onClick={(e) => {
          onCheckedChange?.(!checked);
          props.onClick?.(e);
        }}
        {...props}
      >
        <SwitchThumb $checked={checked} />
      </SwitchRoot>
    );
  }
);
Switch.displayName = "Switch";
