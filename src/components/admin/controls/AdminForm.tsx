'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import styled from 'styled-components';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';

export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined);

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue | undefined>(undefined);

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  if (!itemContext) {
    throw new Error('useFormField should be used within <FormItem>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <FormItemRoot ref={ref} className={className} {...props} />
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = 'FormItem';

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return <FormLabelRoot ref={ref} className={className} data-error={error ? 'true' : undefined} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = 'FormLabel';

export const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={Boolean(error)}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return <FormDescriptionRoot ref={ref} id={formDescriptionId} className={className} {...props} />;
});
FormDescription.displayName = 'FormDescription';

export const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error.message ?? '') : children;

    if (!body) {
      return null;
    }

    return (
      <FormMessageRoot ref={ref} id={formMessageId} className={className} {...props}>
        {body}
      </FormMessageRoot>
    );
  }
);
FormMessage.displayName = 'FormMessage';

const FormItemRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabelRoot = styled(LabelPrimitive.Root)`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;

  &[data-error='true'] {
    color: #b91c1c;
  }
`;

const FormDescriptionRoot = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
`;

const FormMessageRoot = styled.p`
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #b91c1c;
`;
