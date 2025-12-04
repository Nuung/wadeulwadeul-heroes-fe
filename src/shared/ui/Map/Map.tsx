
import {
  MapInstance,
  MarkerInstance,
  LatNLng
} from "@/types/kakao";

import { useEffect, useState } from "react";

const Map = ({
  address = '서울시 중구 세종대로 110',
}: {
  address?: string;
}) => {
  const [map, setMap] = useState<MapInstance | null>(null);

  useEffect(() => {
    console.log('mounted')
    window.kakao?.maps.load(() => {
      initializeMap();
    });    
  }, []);

  // 카카오맵 초기화
  const initializeMap = () => {
  console.log('initializeMap called');
    if (typeof window !== "undefined" && window.kakao && window.kakao.maps) {
      const container = document.getElementById("polygon-map");
      if (!container) {
        console.error("지도 컨테이너가 없습니다.");
        return;
      }

      const center: LatNLng = new window.kakao.maps.LatLng(37.5665, 126.978); // 서울시청 좌표
      const options = {
        center,
        level: 8,
      };

      const kakaoMap: MapInstance = new window.kakao.maps.Map(
        container,
        options,
      );
      console.log('kakaoMap initialized:', kakaoMap);
      setMap(kakaoMap);
    }
  };

  return (
    <div className="relative h-full">
      {/* 지도 컨테이너 */}
      <div id="polygon-map" className="w-full h-full" />
    </div>
  );
};

export { Map };
