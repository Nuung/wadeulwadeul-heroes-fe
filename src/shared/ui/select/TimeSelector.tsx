import { Box, Button, Flex, VStack } from "@vapor-ui/core";
import React, { useState, useEffect } from "react";

interface TimeSelectorProps {
  selectedTime?: number;
  times?: number[];
  onChange?: (value: number) => void;
}

export default function TimeSelector({
  selectedTime = 60,
  times = [30, 60, 90, 120, 150, 180, 210, 240],
  onChange,
}: TimeSelectorProps) {
  const [selected, setSelected] = useState(selectedTime);

  useEffect(() => {
    setSelected(selectedTime);
  }, [selectedTime]);

  const handleSelect = (time: number) => {
    setSelected(time);
    onChange?.(time);
  };

  return (
    <div className="invisible-scrollbar">
      <VStack gap="$050" justifyContent="start" width="100%">
        {times.map((time) => (
          <Button
            key={time}
            colorPalette="primary"
            variant={selected === time ? "fill" : "ghost"}
            size="lg"
            onClick={() => handleSelect(time)}
            className="text-lg"
          >
            {time}
          </Button>
        ))}
      </VStack>
    </div>
  );
}
