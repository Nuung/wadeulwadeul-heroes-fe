import { useEffect, useRef, useState } from 'react';
import { TextInput } from '@vapor-ui/core';
import { Button } from '@vapor-ui/core';
import { HStack, VStack } from '@vapor-ui/core';

// Kakao Map 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [searchAddress, setSearchAddress] = useState('');

  // 지도 초기화
  useEffect(() => {
    if (!mapContainer.current) return;

    const { kakao } = window;
    if (!kakao) return;

    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청 기본 위치
      level: 3,
    };

    const mapInstance = new kakao.maps.Map(mapContainer.current, options);
    setMap(mapInstance);
  }, []);

  // 주소 검색 처리
  const handleSearch = () => {
    if (!searchAddress.trim() || !map) {
      alert('주소를 입력해주세요.');
      return;
    }

    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(searchAddress, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 마커 생성
        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        // 인포윈도우 생성
        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">${result[0].address_name}</div>`,
        });
        infowindow.open(map, marker);

        // 지도 중심 이동
        map.setCenter(coords);
      } else {
        alert('주소 검색에 실패했습니다. 정확한 주소를 입력해주세요.');
      }
    });
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <VStack gap="$200" padding="$200">
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>주소 검색</h1>

      {/* 주소 검색 UI */}
      <HStack gap="$100">
        <TextInput
          type="text"
          size="lg"
          placeholder="주소를 입력하세요 (예: 서울특별시 종로구 세종대로 110)"
          value={searchAddress}
          onValueChange={(value) => setSearchAddress(value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1, minWidth: '400px' }}
        />
        <Button size="lg" onClick={handleSearch}>
          검색
        </Button>
      </HStack>

      {/* 지도 컨테이너 */}
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '600px',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      />
    </VStack>
  );
}
