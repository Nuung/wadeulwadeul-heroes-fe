import { RadioCard, RadioGroup, VStack, Text, Grid } from '@vapor-ui/core';
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
      <Grid.Root templateColumns="repeat(2, 1fr)" gap="$400">
        {options.map((option) => (
          <RadioCard
            key={option.value}
            value={option.value}
            size="lg"
            style={{
              minHeight: '160px',
              height: '160px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <VStack gap="$200" alignItems="center" padding="$300">
              {option.icon && (
                <div className="v-w-20 v-h-20 v-flex v-items-center v-justify-center">
                  {option.icon}
                </div>
              )}
              <Text typography="body1" className="v-text-center v-font-medium">
                {option.label}
              </Text>
            </VStack>
          </RadioCard>
        ))}
      </Grid.Root>
    </RadioGroup.Root>
  );
}
