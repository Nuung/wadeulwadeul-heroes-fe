import React, { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
import "./TimeSelector.css";

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
  const [pickerValue, setPickerValue] = useState({ time: selectedTime });

  useEffect(() => {
    setPickerValue({ time: selectedTime });
  }, [selectedTime]);

  const handleChange = (value: { time: number }) => {
    setPickerValue(value);
    onChange?.(value.time);
  };

  return (
    <div className="time-selector-wrapper">
      <Picker
        value={pickerValue}
        onChange={handleChange}
        wheelMode="natural"
      >
        <Picker.Column name="time">
          {times.map((time) => (
            <Picker.Item key={time} value={time}>
              {time}분
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>
    </div>
  );
}
