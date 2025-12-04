import { RadioCard, RadioGroup, VStack, Text } from '@vapor-ui/core';
import { ReactNode } from 'react';

export interface CategoryOption {
  value: string;
  label: string;
  image?: string;
  icon?: ReactNode;
}

interface CategoryCardProps {
  options: CategoryOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
}

export function CategoryCard({ options, value, onChange, name }: CategoryCardProps) {
  return (
    <RadioGroup.Root
      name={name}
      value={value}
      onValueChange={(val) => {
        if (typeof val === 'string') {
          onChange?.(val);
        }
      }}
    >
      <div className="v-grid v-grid-cols-2 v-gap-4 v-w-full">
        {options.map((option) => (
          <RadioCard key={option.value} value={option.value} size="lg">
            <VStack gap="$150" alignItems="center" padding="$200">
              {option.icon && (
                <div className="v-w-16 v-h-16 v-flex v-items-center v-justify-center">
                  {option.icon}
                </div>
              )}
              <Text typography="body1" className="v-text-center v-font-medium">
                {option.label}
              </Text>
            </VStack>
          </RadioCard>
        ))}
      </div>
    </RadioGroup.Root>
  );
}
