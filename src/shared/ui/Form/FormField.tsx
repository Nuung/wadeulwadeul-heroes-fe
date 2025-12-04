import { Field } from '@vapor-ui/core';
import type { ReactNode } from 'react';

interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  validationMode?: 'onBlur' | 'onChange';
  children: ReactNode;
  className?: string;
  errorMessage?: string;
}

export function FormField({
  name,
  label,
  description,
  required = false,
  disabled = false,
  invalid = false,
  validationMode = 'onBlur',
  children,
  className = '',
  errorMessage,
}: FormFieldProps) {
  return (
    <Field.Root
      name={name}
      disabled={disabled}
      invalid={invalid}
      validationMode={validationMode}
      className={className}
    >
      {label && (
        <Field.Label>
          {label}
          {required && <span className="v-text-danger-500"> *</span>}
        </Field.Label>
      )}
      {children}
      {description && <Field.Description>{description}</Field.Description>}
      {errorMessage && <Field.Error>{errorMessage}</Field.Error>}
    </Field.Root>
  );
}
