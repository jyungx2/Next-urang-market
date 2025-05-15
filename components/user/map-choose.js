// components/MapContainer.jsx
import { loadKakaoMapScript } from "@/lib/\bkakaoMapLoader";
import { useEffect, useRef } from "react";

export default function MapContainer({ lat, lng, setCoords, placeName = "" }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng) return;

    loadKakaoMapScript().then((kakao) => {
      const position = new kakao.maps.LatLng(lat, lng);
      const container = mapRef.current;
      const options = {
        center: position,
        level: 4,
      };

      const map = new kakao.maps.Map(container, options);

      // ✅ 드래그 가능한 마커 추가
      const marker = new kakao.maps.Marker({
        position,
        map,
        draggable: true,
      });

      // ✅ 📍 거래 장소 이름을 나타낼 HTML 생성
      const overlayContent = document.createElement("div");
      overlayContent.innerHTML = `
          <div style="
            background: black;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            white-space: nowrap;
            text-align: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transform: translateY(-100%);
          ">
           ${placeName || "거래 장소"}
          </div>
        `;

      // ✅ CustomOverlay 생성
      const customOverlay = new kakao.maps.CustomOverlay({
        content: overlayContent,
        position,
        yAnchor: 1.2, // 마커 바로 위에 뜨도록
      });
      customOverlay.setMap(map);

      // ✅ 드래그 종료시 위치 업데이트 + overlay 위치도 이동
      kakao.maps.event.addListener(marker, "dragend", function () {
        const position = marker.getPosition();
        setCoords({
          lat: position.getLat(),
          lng: position.getLng(),
        });

        customOverlay.setPosition(pos);
      });

      // ✅ 원형 영역도 마커 중심 기준으로 표시
      // const circle = new kakao.maps.Circle({
      //   center: new kakao.maps.LatLng(lat, lng),
      //   radius: 300, // 단위: m
      //   strokeWeight: 2,
      //   strokeColor: "#0044ff",
      //   fillColor: "#cce0ff",
      //   fillOpacity: 0.3,
      //   map,
      // });

      // circle.setMap(map);
    });
  }, [lat, lng]);

  return <div ref={mapRef} className="w-full h-full rounded-xl" id="map" />;
}
