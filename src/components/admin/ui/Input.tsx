'use client';

import * as React from 'react';
import styled, { css } from 'styled-components';

export const LabelRoot = styled.label<{ $error?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  color: ${({ $error }) => ($error ? '#ef4444' : '#020817')};
  margin-bottom: 8px;
  display: block;
`;

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement> & { error?: boolean }>(
  ({ className, error, ...props }, ref) => (
    <LabelRoot ref={ref} className={className} $error={error} {...props} />
  )
);
Label.displayName = "Label";

const inputStyles = css<{ $error?: boolean }>`
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid ${({ $error }) => ($error ? '#ef4444' : '#e2e8f0')};
  background-color: transparent;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #020817;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.primary || '#003CA6')};
    box-shadow: 0 0 0 2px ${({ $error, theme }) => ($error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 60, 166, 0.2)')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #f1f5f9;
  }
`;

export const InputRoot = styled.input`
  ${inputStyles}
`;

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }>(
  ({ className, error, ...props }, ref) => (
    <InputRoot ref={ref} className={className} $error={error} {...props} />
  )
);
Input.displayName = "Input";

export const TextareaRoot = styled.textarea`
  ${inputStyles}
  min-height: 80px;
  resize: vertical;
`;

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }>(
  ({ className, error, ...props }, ref) => (
    <TextareaRoot ref={ref} className={className} $error={error} {...props} />
  )
);
Textarea.displayName = "Textarea";
