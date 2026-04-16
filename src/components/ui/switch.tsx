'use client';

import * as React from 'react';
import styled from 'styled-components';

type SwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'default';
};

const SwitchRoot = styled.button<{ $checked: boolean; $size: 'sm' | 'default' }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 9999px;
  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.primary : theme.colors.borderInput};
  width: ${({ $size }) => ($size === 'sm' ? '24px' : '32px')};
  height: ${({ $size }) => ($size === 'sm' ? '14px' : '18px')};
  padding: 0;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.motion.duration.base}
    ${({ theme }) => theme.motion.easing.easeInOut};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SwitchThumb = styled.span<{ $checked: boolean; $size: 'sm' | 'default' }>`
  position: absolute;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.white};
  width: ${({ $size }) => ($size === 'sm' ? '10px' : '14px')};
  height: ${({ $size }) => ($size === 'sm' ? '10px' : '14px')};
  left: 1px;
  transform: translateX(
    ${({ $checked, $size }) => {
      if (!$checked) return '0';
      return $size === 'sm' ? '10px' : '14px';
    }}
  );
  transition: transform ${({ theme }) => theme.motion.duration.base}
    ${({ theme }) => theme.motion.easing.easeInOut};
`;

function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  size = 'default',
  onClick,
  ...props
}: SwitchProps) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultChecked));
  const isChecked = isControlled ? Boolean(checked) : internalChecked;

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    const nextValue = !isChecked;

    if (!isControlled) {
      setInternalChecked(nextValue);
    }

    onCheckedChange?.(nextValue);
  };

  return (
    <SwitchRoot
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-disabled={disabled}
      disabled={disabled}
      $checked={isChecked}
      $size={size}
      onClick={handleToggle}
      {...props}
    >
      <SwitchThumb $checked={isChecked} $size={size} />
    </SwitchRoot>
  );
}

export { Switch };
