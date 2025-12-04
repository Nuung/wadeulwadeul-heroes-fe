import { useState } from 'react';
import { TextInput, Button, VStack, HStack, Text, Box } from '@vapor-ui/core';
import type { GeocoderResult } from '../../types/kakao';

interface AddressSearchProps {
  value?: string;
  onChange?: (address: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AddressSearch({
  value = '',
  onChange,
  placeholder = '주소를 검색하세요',
  disabled = false,
}: AddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [results, setResults] = useState<GeocoderResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(value);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(searchQuery, (result, status) => {
      setIsSearching(false);

      if (status === window.kakao.maps.services.Status.OK) {
        setResults(result);
      } else {
        setResults([]);
        alert('주소를 찾을 수 없습니다. 다시 시도해주세요.');
      }
    });
  };

  const handleSelectAddress = (result: GeocoderResult) => {
    const address = result.address_name;
    const coordinates = {
      lat: parseFloat(result.y),
      lng: parseFloat(result.x),
    };

    setSelectedAddress(address);
    setSearchQuery(address);
    setResults([]);
    onChange?.(address, coordinates);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <VStack gap="$150" width="100%">
      <HStack gap="$100" width="100%">
        <TextInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="v-flex-1"
        />
        <Button onClick={handleSearch} disabled={disabled || isSearching}>
          {isSearching ? '검색 중...' : '검색'}
        </Button>
      </HStack>

      {selectedAddress && !results.length && (
        <Box
          padding="$150"
          backgroundColor="$primary-100"
          borderRadius="$100"
          className="v-border v-border-primary-300"
        >
          <Text typography="body1" foreground="primary-200">
            선택된 주소: {selectedAddress}
          </Text>
        </Box>
      )}

      {results.length > 0 && (
        <VStack gap="$075" width="100%">
          <Text typography="body1" className="v-font-medium">
            검색 결과
          </Text>
          {results.map((result, index) => (
            <Box
              key={index}
              padding="$150"
              backgroundColor="$canvas-100"
              borderRadius="$100"
              className="v-cursor-pointer hover:v-bg-gray-100 v-transition-colors v-border v-border-gray-200"
              onClick={() => handleSelectAddress(result)}
            >
              <VStack gap="$050">
                <Text typography="body1" className="v-font-medium">
                  {result.address_name}
                </Text>
                {result.road_address && (
                  <Text typography="body2" foreground="hint-100">
                    도로명: {result.road_address.address_name}
                  </Text>
                )}
              </VStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
