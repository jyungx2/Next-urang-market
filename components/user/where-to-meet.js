// components/MapContainer.jsx
import { loadKakaoMapScript } from "@/lib/\bkakaoMapLoader";
import { useEffect, useRef } from "react";

export default function WhereToMeet({ lat, lng }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng) return;

    loadKakaoMapScript().then((kakao) => {
      const container = mapRef.current;
      const options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 5,
      };

      const map = new kakao.maps.Map(container, options);

      // 마커 추가
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map,
      });
    });
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-xl border-2 border-[var(--color-secondary-800)]"
      id="map"
    />
  );
}
