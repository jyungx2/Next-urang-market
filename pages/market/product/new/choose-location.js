import Layout from "@/components/layout/layout";
import MapContainer from "@/components/user/map-choose";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ChooseLocation() {
  const router = useRouter();
  const [coords, setCoords] = useState({ lat: null, lng: null });

  useEffect(() => {
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
    <div className="bg-amber-50 p-6 flex flex-col min-h-screen">
      <header className="shrink-0">
        <button
          onClick={() => router.back()}
          type="button"
          className="cursor-pointer"
        >
          <Image src="/icons/xbtn.svg" alt="icon" width={30} height={30} />
        </button>

        <h1 className="text-[2.4rem] font-bold mb-2">Choose where to meet</h1>
        <p>We recommend public places that are easy to get to.</p>
      </header>

      <div className="relative h-[60rem] mt-10 bg-amber-100">
        {/* 지도 컴포넌트 */}
        {coords.lat != null && coords.lng != null && (
          <MapContainer
            lat={coords.lat}
            lng={coords.lng}
            setCoords={setCoords}
          />
        )}
        {/* Done 버튼 (지도 위에 떠 있음) */}
        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 font-bold h-[4rem] bg-[var(--color-primary-600)] p-4 w-[96%] rounded-lg text-white cursor-pointer z-100">
          Done
        </button>
      </div>
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ChooseLocation.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
