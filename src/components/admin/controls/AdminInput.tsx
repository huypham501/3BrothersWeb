import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import styled from 'styled-components';

type AdminInputProps = Omit<React.ComponentProps<'input'>, 'value'> & {
  value?: string | number | readonly string[] | null;
};

export function AdminInput({ value, ...props }: AdminInputProps) {
  const normalizedValue = value ?? '';
  return <InputRoot value={normalizedValue} {...props} />;
}

const InputRoot = styled(InputPrimitive)`
  height: 36px;
  width: 100%;
  min-width: 0;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  padding: 0 10px;
  color: #0f172a;
  font-size: 0.875rem;
  line-height: 1.25rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus-visible {
    border-color: #334155;
    box-shadow: 0 0 0 3px rgba(51, 65, 85, 0.16);
  }

  &:disabled {
    cursor: not-allowed;
    background: #f8fafc;
    opacity: 0.7;
  }
`;
