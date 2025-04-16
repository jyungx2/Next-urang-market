// components/MapContainer.jsx
import { loadKakaoMapScript } from "@/lib/\bkakaoMapLoader";
import { useEffect, useRef } from "react";

export default function MapContainer({ lat, lng }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng) return;

    loadKakaoMapScript().then((kakao) => {
      const container = mapRef.current;
      const options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 4,
      };

      const map = new kakao.maps.Map(container, options);

      // 마커 추가
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map,
      });

      // 원형 영역 표시 예시 (선택)
      const circle = new kakao.maps.Circle({
        center: new kakao.maps.LatLng(lat, lng),
        radius: 300, // 단위: m
        strokeWeight: 2,
        strokeColor: "#0044ff",
        fillColor: "#cce0ff",
        fillOpacity: 0.3,
        map,
      });

      circle.setMap(map);
    });
  }, [lat, lng]);

  return (
    <div ref={mapRef} className="w-full h-[400px] rounded-xl border" id="map" />
  );
}
