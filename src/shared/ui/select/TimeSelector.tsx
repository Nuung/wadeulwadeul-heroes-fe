import { Box, Button, Flex, VStack } from "@vapor-ui/core";
import React, { useState } from "react";

interface TimeSelectorProps {
  selectedTime?: string;
  times?: string[];
}

export default function TimeSelector({
  selectedTime = "60 minutes",
  times = [
    "15 minutes",
    "30 minutes",
    "45 minutes",
    "60 minutes",
    "75 minutes",
    "90 minutes",
    "105 minutes",
    "120 minutes",
  ],
}: TimeSelectorProps) {
  const [selected, setSelected] = useState(selectedTime);

  return (
    <div className="invisible-scrollbar">
      <VStack gap="$050" justifyContent="start" width="100%">
        {times.map((time) => (
          <Button
            key={time}
            colorPalette="primary"
            variant={selected === time ? "fill" : "ghost"}
            size="lg"
            onClick={() => setSelected(time)}
            className="text-lg"
          >
            {time}
          </Button>
        ))}
      </VStack>
    </div>
  );
}
