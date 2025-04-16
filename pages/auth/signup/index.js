import useUserStore from "@/zustand/userStore";
import Image from "next/image";
import { useRouter } from "next/router";
import classes from "@/components/main/search-form.module.css";
import ClipLoader from "react-spinners/ClipLoader"; // ✅ 스피너 import
import { useRef, useState } from "react";
import MapContainer from "@/components/user/map";

export default function LocationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { location, setLocation } = useUserStore();
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const addressRef = useRef();
  const [searchResults, setSearchResults] = useState([]);

  const selectMyLocation = async (fullAddress) => {
    // 1. 인풋 값 업데이트
    addressRef.current.value = fullAddress;
    setSearchResults([]);

    // 2. 카카오 주소 → 좌표 API 요청
    try {
      const res = await fetch(
        `/api/auth/kakao-addToGeo?address=${encodeURIComponent(fullAddress)}`
      );
      const data = await res.json();

      if (!res.ok || !data.documents?.length) {
        throw new Error("주소를 좌표로 변환할 수 없습니다.");
      }

      const { x, y } = data.documents[0]; // 카카오 api(주소➡️좌표 변환)는 보통 가장 정확하다고 판단된 주소의 좌표를 배열의 첫번째 요소로 리턴 (∵ 내부적으로 정확도(score) 기준 정렬) -> x = 경도(lng), y = 위도(lat)
      setCoords({ lat: parseFloat(y), lng: parseFloat(x) });
    } catch (err) {
      console.error("주소 -> 좌표 변환 실패: ", err);
      alert("지도를 이동할 수 없습니다.");
    }
  };

  // getCurrentPosition(): 브라우저에서 위치를 요청하는 "비동기 함수"
  // 📌 fetch()랑 아무 관계 없음
  // 📌 성공(실패)하면 → 성공(실패) 콜백 실행
  const getMyLocation = () => {
    setIsLoading(true);
    // ✅ 1.5초간 인위적 로딩 시간
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;
          setCoords({ lat: latitude, lng: longitude }); // ✅ 좌표 저장

          try {
            const res = await fetch(
              `/api/auth/kakao-geocode?lat=${latitude}&lng=${longitude}`
            );
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "서버 에러");

            setLocation(data.regionName);
            setIsLoading(false); // 스피너 종료

            console.log("✅ 위치 설정 완료:", data.regionName);
          } catch (err) {
            console.error("❌ 위치 요청 실패:", err);
            alert(err.message || "위치 정보를 가져오는데 실패했습니다.");
            setIsLoading(false); // 실패 시도 종료
          }
        },
        (err) => {
          console.error("위치 에러:", err);
          alert("위치 권한을 허용해주세요.");
          setIsLoading(false);
        }
      );
    }, 1500); // 1.5초 로딩 타임
  };

  // 주소 검색 API 호출 함수 (검색어로 한 번 전체 데이터 가져오기)
  const fetchLocations = async (keyword) => {
    try {
      const res = await fetch(
        `/api/search-location?keyword=${encodeURIComponent(keyword)}`
      );
      const data = await res.json();
      return data.locations || [];
    } catch (error) {
      console.error("주소 검색 오류:", error);
      return [];
    }
  };

  // 인풋의 엔터 이벤트로 검색 수행 (ref 방식)
  const handleAddressSearch = async () => {
    const value = addressRef.current.value.trim();
    if (value.length < 2) return;
    setIsLoading(true);
    const results = await fetchLocations(value);
    setSearchResults(results);
    setIsLoading(false);
  };

  return (
    <div className="max-w-[640px] mx-auto min-h-screen bg-[var(--color-bg)] flex flex-col p-4">
      <header className="flex items-center justify-center mb-2 pb-4 gap-4">
        <button
          onClick={() => router.back()}
          type="button"
          className="relative w-[30px] aspect-square cursor-pointer"
        >
          <Image
            src="/icons/chevron-left.svg"
            alt="icon"
            fill
            className="cursor-pointer"
          />
        </button>

        <div className="relative flex-grow rounded-2xl bg-[var(--color-grey-200)] p-1">
          <input
            ref={addressRef}
            type="text"
            className={`${classes.inputUnset} ${classes.searchInput}`}
            placeholder="주소를 입력하세요."
            onKeyDown={(e) => e.key === "Enter" && handleAddressSearch()}
          />

          {/* 드롭다운 검색 결과 */}
          {searchResults.length > 0 && (
            <ul className="absolute z-10 top-full left-0 w-full mt-2 bg-white border rounded-xl shadow-md max-h-[300px] overflow-y-auto">
              {searchResults.map((item, idx) => (
                <li
                  key={idx}
                  className="p-4 hover:bg-gray-100 text-[1.5rem] cursor-pointer"
                  onClick={() => {
                    // 예: 주소 선택 시, 인풋에 값을 넣고 드롭다운 숨김
                    handleAddressSearch(item.full);
                    selectMyLocation(item.full);
                  }}
                >
                  {item.full}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div>
        <button
          className="w-full bg-[var(--color-primary-500)] cursor-pointer p-4 rounded-xl font-bold text-white mb-8"
          onClick={getMyLocation}
        >
          Find nearby neighborhoods
        </button>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-8 mt-20">
            {/* ✅ react-spinners 사용 */}

            <ClipLoader
              color={"#2563eb"} // 파란색 (Tailwind 기준 var(--color-primary-500))
              size={60}
              speedMultiplier={1}
            />
            <p className="text-gray-600 font-medium text-[2rem]">
              위치를 확인 중입니다...
            </p>
          </div>
        )}

        {!isLoading && location && (
          <>
            <p className="text-[1.8rem]">
              현재 위치: <span className="font-bold">{location}</span>
            </p>
            <div className="mt-8">
              <MapContainer lat={coords.lat} lng={coords.lng} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ✅ Layout 적용 안 하도록 getLayout 설정
LocationPage.getLayout = function noLayout(page) {
  return page; // Layout 안 씌움
};
