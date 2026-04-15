import * as React from 'react';
import styled from 'styled-components';

export function AdminTextarea(props: React.ComponentProps<'textarea'>) {
  return <TextareaRoot {...props} />;
}

const TextareaRoot = styled.textarea`
  width: 100%;
  min-height: 72px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  padding: 10px;
  color: #0f172a;
  font-size: 0.875rem;
  line-height: 1.35rem;
  outline: none;
  resize: vertical;
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
