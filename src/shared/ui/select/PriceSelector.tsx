import React, { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
import "./PriceSelector.css";

interface PriceSelectorProps {
  selectedPrice?: number;
  prices?: number[];
  onChange?: (value: number) => void;
}

export default function PriceSelector({
  selectedPrice = 5000,
  prices = Array.from({ length: 20 }, (_, i) => (i + 1) * 5000),
  onChange,
}: PriceSelectorProps) {
  const [pickerValue, setPickerValue] = useState({ price: selectedPrice });

  useEffect(() => {
    setPickerValue({ price: selectedPrice });
  }, [selectedPrice]);

  const handleChange = (value: { price: number }) => {
    setPickerValue(value);
    onChange?.(value.price);
  };

  return (
    <div className="price-selector-wrapper">
      <Picker
        value={pickerValue}
        onChange={handleChange}
        wheelMode="natural"
      >
        <Picker.Column name="price">
          {prices.map((price) => (
            <Picker.Item key={price} value={price}>
              {price.toLocaleString()}원
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>
    </div>
  );
}
