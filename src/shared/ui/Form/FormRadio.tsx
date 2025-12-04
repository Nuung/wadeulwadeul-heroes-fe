import { Radio, RadioGroup, Field, VStack, HStack } from '@vapor-ui/core';
import type { ReactNode } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormRadioGroupProps {
  name?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  size?: 'md' | 'lg';
  className?: string;
  direction?: 'vertical' | 'horizontal';
}

export function FormRadioGroup({
  name,
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  size = 'md',
  className = '',
  direction = 'vertical',
}: FormRadioGroupProps) {
  const Stack = direction === 'vertical' ? VStack : HStack;
  const gap = direction === 'vertical' ? 2 : 4;

  return (
    <RadioGroup.Root
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(newValue) => {
        if (onChange && typeof newValue === 'string') {
          onChange(newValue);
        }
      }}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      size={size}
      className={className}
    >
      <Stack gap={gap}>
        {options.map((option) => (
          <RadioItem
            key={option.value}
            value={option.value}
            label={option.label}
            disabled={option.disabled ?? disabled}
            size={size}
          />
        ))}
      </Stack>
    </RadioGroup.Root>
  );
}

interface RadioItemProps {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  size?: 'md' | 'lg';
}

function RadioItem({ value, label, disabled, size = 'md' }: RadioItemProps) {
  return (
    <HStack gap={2} alignItems="center">
      <Radio.Root value={value} disabled={disabled} size={size} />
      <Field.Label>{label}</Field.Label>
    </HStack>
  );
}
