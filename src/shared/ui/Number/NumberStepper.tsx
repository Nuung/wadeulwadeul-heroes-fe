import { useState, useEffect } from "react";
import { VStack, Text, HStack, IconButton, TextInput } from "@vapor-ui/core";
import { MinusOutlineIcon, PlusOutlineIcon } from "@vapor-ui/icons";

interface NumberStepperProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  showButtons?: boolean;
  disabled?: boolean;
}

export function NumberStepper({
  value = 0,
  onChange,
  min = 0,
  max = 999999,
  showButtons = true,
  disabled = false
}: NumberStepperProps) {
  const [count, setCount] = useState(value);

  useEffect(() => {
    setCount(value);
  }, [value]);

  const updateCount = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);
    setCount(clampedValue);
    onChange?.(clampedValue);
  };

  const handleDecrement = () => {
    if (count > min) {
      updateCount(count - 1);
    }
  };

  const handleIncrement = () => {
    if (count < max) {
      updateCount(count + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      updateCount(newValue);
    }
  };

  if (!showButtons) {
    return (
      <TextInput
        type="number"
        value={count.toString()}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
      />
    );
  }

  return (
    <VStack gap="$075" justifyContent="start" width="100%">
      <HStack alignItems="center" justifyContent="center" gap="$150">
        <IconButton
          shape="circle"
          aria-label="숫자 감소 버튼"
          disabled={disabled || count === min}
          onClick={handleDecrement}
        >
          <MinusOutlineIcon />
        </IconButton>
        <Text typography="display1">{count}</Text>
        <IconButton
          shape="circle"
          aria-label="숫자 증가 버튼"
          disabled={disabled || count === max}
          onClick={handleIncrement}
        >
          <PlusOutlineIcon />
        </IconButton>
      </HStack>
    </VStack>
  );
}
