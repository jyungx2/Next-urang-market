// components/MapContainer.jsx
import { loadKakaoMapScript } from "@/lib/\bkakaoMapLoader";
import { useEffect, useRef } from "react";

export default function MapChooseContainer({
  lat,
  lng,
  setCoords,
  placeName,
  showOverlay,
  setShowOverlay,
}) {
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
      new kakao.maps.Marker({
        position,
        map,
        draggable: true,
      });

      if (showOverlay) {
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
           ${placeName || "지도를 움직여 장소를 설정해주세요."}
          </div>
        `;

        // ✅ CustomOverlay 생성
        const customOverlay = new kakao.maps.CustomOverlay({
          content: overlayContent,
          position,
          yAnchor: 1.2, // 마커 바로 위에 뜨도록
        });
        customOverlay.setMap(map);
      }

      // ✅ 드래그 종료시 위치 업데이트 + overlay 위치도 이동
      // kakao.maps.event.addListener(marker, "dragend", function () {
      //   const position = marker.getPosition();
      //   setCoords({
      //     lat: position.getLat(),
      //     lng: position.getLng(),
      //   });

      //   map.setCenter(position); // ✅ 지도의 중심도 마커 위치로 옮기기 (선택)

      //   if (customOverlay) {
      //     customOverlay.setMap(null); // 📍 마커 이동하면 무조건 라벨 제거
      //   }
      // });

      // ✅ 지도 중심이 바뀔 때마다 마커 위치 이동 & 상태 저장
      kakao.maps.event.addListener(map, "idle", () => {
        const center = map.getCenter();
        // marker.setPosition(center); // 마커를 중심으로 이동
        setCoords({ lat: center.getLat(), lng: center.getLng() });
        setShowOverlay(false);
      });

      // ✅ 최초에도 중심값 저장
      setCoords({
        lat: map.getCenter().getLat(),
        lng: map.getCenter().getLng(),
      });
    });
  }, [lat, lng, showOverlay, placeName]);

  return <div ref={mapRef} className="w-full h-full rounded-xl" id="map" />;
}
