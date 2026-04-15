'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import styled from 'styled-components';

type AdminSwitchProps = SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'default';
};

export function AdminSwitch({ size = 'default', ...props }: AdminSwitchProps) {
  return (
    <SwitchRoot data-size={size} {...props}>
      <Thumb />
    </SwitchRoot>
  );
}

const SwitchRoot = styled(SwitchPrimitive.Root)`
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid transparent;
  outline: none;
  transition: all 0.2s ease;
  background: #cbd5e1;

  &[data-size='default'] {
    width: 32px;
    height: 18px;
  }

  &[data-size='sm'] {
    width: 24px;
    height: 14px;
  }

  &[data-checked] {
    background: #0f172a;
  }

  &:focus-visible {
    border-color: #334155;
    box-shadow: 0 0 0 3px rgba(51, 65, 85, 0.16);
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const Thumb = styled(SwitchPrimitive.Thumb)`
  display: block;
  border-radius: 999px;
  background: #ffffff;
  transition: transform 0.2s ease;

  [data-size='default'] & {
    width: 14px;
    height: 14px;
    transform: translateX(1px);
  }

  [data-size='default'][data-checked] & {
    transform: translateX(15px);
  }

  [data-size='sm'] & {
    width: 10px;
    height: 10px;
    transform: translateX(1px);
  }

  [data-size='sm'][data-checked] & {
    transform: translateX(11px);
  }
`;
