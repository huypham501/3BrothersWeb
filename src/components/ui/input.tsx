import * as React from 'react';
import styled from 'styled-components';

type InputProps = Omit<React.ComponentProps<'input'>, 'value'> & {
  value?: string | number | readonly string[] | null;
};

const InputRoot = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 38px;
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.white};
  transition:
    border-color ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut},
    box-shadow ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 60, 166, 0.12);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    background: ${({ theme }) => theme.colors.gray100};
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.error};
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.18);
  }
`;

function Input({ value, ...props }: InputProps) {
  const normalizedValue = value ?? '';
  return <InputRoot value={normalizedValue} {...props} />;
}

export { Input };
