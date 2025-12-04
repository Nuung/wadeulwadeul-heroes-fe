import { useState } from "react";
import { VStack, Text, HStack, IconButton } from "@vapor-ui/core";
import { MinusOutlineIcon, PlusOutlineIcon } from "@vapor-ui/icons";

interface NumberStepperProps {
  value: number;
}

export function NumberStepper({ value }: NumberStepperProps) {
  const [count, setCount] = useState(value);

  const handleDecrement = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <VStack gap="$075" justifyContent="start" width="100%">
      <HStack alignItems="center" justifyContent="center">
        <IconButton
          shape="circle"
          aria-label="숫자 감소 버튼"
          disabled={count === 0}
          onClick={handleDecrement}
        >
          <MinusOutlineIcon />
        </IconButton>
        <Text typography="display1">{count}</Text>
        <IconButton
          shape="circle"
          aria-label="숫자 증가 버튼"
          onClick={handleIncrement}
        >
          <PlusOutlineIcon />
        </IconButton>
      </HStack>
    </VStack>
  );
}
