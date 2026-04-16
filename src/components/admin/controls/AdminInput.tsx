'use client';

import * as React from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';

type AdminInputProps = Omit<InputProps, 'value'> & {
  value?: string | number | readonly string[] | null;
};

export function AdminInput({ value, ...props }: AdminInputProps) {
  const normalizedValue = value ?? '';
  return <Input value={normalizedValue} {...props} />;
}
