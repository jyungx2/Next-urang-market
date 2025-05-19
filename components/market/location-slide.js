import Layout from "@/components/layout/layout";
import LocationModal from "@/components/market/location-modal";
import MapChooseContainer from "@/components/user/map-choose";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LocationSlide({
  setShowSlide,
  coords,
  setCoords,
  setPlaceName,
}) {
  const router = useRouter();

  // 유저가 이미 지정한 위치가 있다면, 위치 마커가 router.query.lat/lng 포지션으로 설정되어 있어야 되기 때문에 아래와 같은 변수 설정
  const initialLat = parseFloat(router.query.lat) || null;
  const initialLng = parseFloat(router.query.lng) || null;

  const [showOverlay, setShowOverlay] = useState(true); // 라벨 표시 여부
  const [showModal, setShowModal] = useState(false); // 사용자 입력 장소 이름

  // 페이지 접속하자마자 내 위치 가져오기(최초 접속 시에만 실행)
  useEffect(() => {
    console.log(
      "choose-location 페이지 마운팅 후 실행되는 useEffect: ",
      coords.lat,
      coords.lng
    );

    // 유저가 이미 지정한 위치가 있다면, router.query.lat/lng이 null이 아니고, 그 위치로 남아있어야 하기 때문에 아래와 같이 설정..
    if (initialLat !== null && initialLng !== null) return;

    const getMyLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;
          setCoords({ lat: latitude, lng: longitude }); // ✅ 좌표 저장(지도 표시용 상태)
          console.log(latitude, longitude);
          console.log("😃 coords.lat: ", coords.lat);
        },
        (err) => {
          console.error("위치 에러:", err);
          alert("위치 권한을 허용해주세요.");
        }
      );
    };
    getMyLocation();
  }, []);

  return (
    <div className="bg-[var(--color-bg)] flex flex-col min-h-screen">
      <header className="shrink-0">
        <button
          onClick={() => setShowSlide(false)}
          type="button"
          className="cursor-pointer mb-4"
        >
          <Image src="/icons/xbtn.svg" alt="icon" width={30} height={30} />
        </button>

        <h1 className="text-[2.4rem] font-bold mb-2">Choose where to meet</h1>
        <p>We recommend public places that are easy to get to.</p>
      </header>

      <div className="relative h-[60rem] mt-10">
        {/* 지도 컴포넌트 */}
        {coords.lat != null && coords.lng != null && (
          <MapChooseContainer
            lat={coords.lat}
            lng={coords.lng}
            setCoords={setCoords}
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
          />
        )}

        {showModal ? (
          <LocationModal
            coords={coords}
            onClose={() => setShowModal(false)}
            onSave={(value) => {
              setPlaceName(value); // 라벨 내용 설정
              setShowOverlay(true); // 라벨 표시 트리거
              setShowSlide(false); // 인풋 모달 닫기
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
LocationSlide.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
