// src/components/Map.tsx
import React, { useEffect } from 'react';

declare const kakao: any;

interface MapProps {
  latitude: number;
  longitude: number;
}

function Map({ latitude, longitude }: MapProps) {
  useEffect(() => {
    const container = document.getElementById('map'); // 지도를 표시할 div
    const options = {
      center: new kakao.maps.LatLng(latitude, longitude), // 중심 좌표 설정
      level: 3, // 확대 레벨 설정
    };

    const map = new kakao.maps.Map(container, options); // 지도 생성

    // 마커 생성 및 지도에 추가
    const markerPosition = new kakao.maps.LatLng(latitude, longitude);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  }, [latitude, longitude]); // 위도, 경도 변경 시마다 지도 업데이트

  return (
    <div>
      <div
        id="map"
        style={{
          width: '100%',
          height: '400px',
        }}
      />
    </div>
  );
}

export default Map;
