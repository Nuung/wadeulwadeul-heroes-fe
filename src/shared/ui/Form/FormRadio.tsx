import { Radio, RadioGroup } from '@vapor-ui/core';
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
  const containerClassName = direction === 'vertical' ? 'v-space-y-2' : 'v-flex v-gap-4';

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
      <div className={containerClassName}>
        {options.map((option) => (
          <RadioItem
            key={option.value}
            value={option.value}
            label={option.label}
            disabled={option.disabled ?? disabled}
            size={size}
          />
        ))}
      </div>
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
    <div className="v-flex v-items-center v-gap-2">
      <Radio.Root value={value} disabled={disabled} size={size} />
      <label className="v-text-sm v-cursor-pointer">{label}</label>
    </div>
  );
}
