import { TextInput } from '@vapor-ui/core';
import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

export interface FormInputProps extends Omit<ComponentProps<typeof TextInput>, 'render'> {
  name?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ size = 'md', type = 'text', className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        size={size}
        type={type}
        className={className}
        {...props}
      />
    );
  }
);

FormInput.displayName = 'FormInput';
