import { LatLng, MapInstance, MarkerInstance } from "@/types/kakao";
import { useEffect, useState } from "react";

interface MapProps {
  address: string;
  className?: string;
  onAddressNotFound?: () => void;
}

const Map = ({ address, className = "", onAddressNotFound }: MapProps) => {
  const [map, setMap] = useState<MapInstance | null>(null);
  const [marker, setMarker] = useState<MarkerInstance | null>(null);

  useEffect(() => {
    window.kakao?.maps.load(() => {
      initializeMap();
    });

    return () => {
      // 마커 제거
      if (marker) {
        marker.setMap(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!map || !address) return;

    // 주소로 좌표 검색
    searchAddressAndDisplayMarker(address);
  }, [map, address]);

  // 카카오맵 초기화
  const initializeMap = () => {
    if (typeof window !== "undefined" && window.kakao && window.kakao.maps) {
      const container = document.getElementById("map");
      if (!container) {
        console.error("지도 컨테이너가 없습니다.");
        return;
      }

      // 기본 중심 좌표 (서울시청)
      const center: LatLng = new window.kakao.maps.LatLng(37.5665, 126.978);
      const options = {
        center,
        level: 3, // 확대 레벨 (숫자가 작을수록 더 확대됨)
      };

      const kakaoMap: MapInstance = new window.kakao.maps.Map(
        container,
        options,
      );
      setMap(kakaoMap);
    }
  };

  // 주소로 좌표를 검색하고 마커 표시
  const searchAddressAndDisplayMarker = (address: string) => {
    if (!map) return;

    // Geocoder 생성
    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소로 좌표 검색
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(
          Number(result[0].y),
          Number(result[0].x),
        );

        // 기존 마커 제거
        if (marker) {
          marker.setMap(null);
        }

        // 새 마커 생성
        const newMarker = new window.kakao.maps.Marker({
          position: coords,
          map: map,
        });

        setMarker(newMarker);

        // 지도 중심을 결과값으로 이동
        map.setCenter(coords);
      } else {
        console.error("주소 검색 실패:", status);
        onAddressNotFound?.();
      }
    });
  };

  return (
    <div className={`relative h-full ${className}`}>
      {/* 지도 컨테이너 */}
      <div id="map" className="w-full h-full" />
    </div>
  );
};

export { Map };
