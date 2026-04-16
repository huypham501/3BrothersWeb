'use client';

import * as React from 'react';
import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input';

const { TextArea } = Input;

export function AdminTextarea(props: TextAreaProps) {
  return <TextArea autoSize={{ minRows: 3 }} {...props} />;
}
