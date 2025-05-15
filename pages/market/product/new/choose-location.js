import Layout from "@/components/layout/layout";
import LocationModal from "@/components/market/location-modal";
import MapChooseContainer from "@/components/user/map-choose";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ChooseLocation() {
  const router = useRouter();
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const [showOverlay, setShowOverlay] = useState(true); // 라벨 표시 여부
  const [showModal, setShowModal] = useState(false); // 사용자 입력 장소 이름
  const [placeName, setPlaceName] = useState("");

  // 페이지 접속하자마자 내 위치 가져오기
  useEffect(() => {
    if (coords.lat !== null && coords.lng !== null) return;

    const getMyLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;
          setCoords({ lat: latitude, lng: longitude }); // ✅ 좌표 저장(지도 표시용 상태)
          console.log(latitude, longitude);
        },
        (err) => {
          console.error("위치 에러:", err);
          alert("위치 권한을 허용해주세요.");
        }
      );
    };

    console.log("useEffect 실행!", coords.lat, coords.lng);
    getMyLocation();
  }, []);

  return (
    <div className="bg-[var(--color-bg)] p-6 flex flex-col min-h-screen">
      <header className="shrink-0">
        <button
          onClick={() => router.back()}
          type="button"
          className="cursor-pointer mb-4"
        >
          <Image src="/icons/xbtn.svg" alt="icon" width={30} height={30} />
        </button>

        <h1 className="text-[2.4rem] font-bold mb-2">Choose where to meet</h1>
        <p>We recommend public places that are easy to get to.</p>
      </header>

      <div className="relative h-[60rem] mt-10 bg-amber-100">
        {/* 지도 컴포넌트 */}
        {coords.lat != null && coords.lng != null && (
          <MapChooseContainer
            lat={coords.lat}
            lng={coords.lng}
            setCoords={setCoords}
            placeName={placeName}
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
          />
        )}

        {showModal ? (
          <LocationModal
            onClose={() => setShowModal(false)}
            onSave={(value) => {
              setPlaceName(value); // 라벨 내용 설정
              setShowOverlay(true); // 라벨 표시 트리거
              setShowModal(false); // 인풋 모달 닫기
            }}
          />
        ) : (
          <button
            className="absolute bottom-4 left-1/2 -translate-x-1/2 font-bold h-[4rem] bg-[var(--color-primary-600)] p-4 w-[96%] rounded-lg text-white cursor-pointer z-100"
            onClick={() => setShowModal(true)}
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ChooseLocation.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
