import useUserStore from "@/zustand/userStore";
import Image from "next/image";
import { useRouter } from "next/router";
import classes from "@/components/main/search-form.module.css";
import ClipLoader from "react-spinners/ClipLoader"; // ✅ 스피너 import
import { useRef, useState } from "react";
import MapContainer from "@/components/user/map";
import SearchLocationInput from "@/components/common/search-location-input";

export default function LocationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setLocation } = useUserStore();
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [neighborhood, setNeighborhood] = useState("");
  const [rcode, setRcode] = useState("");

  // ⭐️ SearchLocationInput 리팩토링 ⭐️
  const [searchResults, setSearchResults] = useState([]);
  const addressRef = useRef();

  const moveToLocation = async (fullAddress) => {
    // 1. 인풋 값 업데이트 => SearchLocationInput 컴포넌트로 이동
    // addressRef.current.value = fullAddress;
    // setSearchResults([]);

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

            setIsLoading(false); // 스피너 종료
            setNeighborhood(data.regionName);
            setRcode(data.rcode);

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

  const goGetVerification = async (neighborhood, rcode) => {
    console.log("인증절차");
    router.push("/auth/signup/phone-verify");

    const keyword = neighborhood.split(" ");

    const addressObj = {
      id: Date.now(),
      keyword,
      isVerified: false, // 회원가입할 땐 위치인증절차 안거치므로 일단 무조건 false
      rcode,
    };

    setLocation(addressObj);
    console.log("zustand에 저장된 유저의 동네:", location, addressObj);
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

        <SearchLocationInput
          addressRef={addressRef}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          onSelect={(fullAddress, rcode) => {
            moveToLocation(fullAddress); // 지도 이동
            setNeighborhood(fullAddress); // 주소값 UI 렌더링
            setRcode(rcode); // 지역코드 상태 업데이트
            addressRef.current.value = "";
            setSearchResults([]);
          }}
          setIsLoading={setIsLoading}
        />
      </header>

      <div>
        <button
          className="w-full bg-[var(--color-primary-500)] cursor-pointer p-4 rounded-xl font-bold text-white mb-8"
          onClick={getMyLocation}
        >
          현재 내 위치 찾기
        </button>

        <p className="text-[1.4rem] text-gray-500 mb-4">
          ⚠️ 정확한 위치 검색을 위해 주소는 반드시{" "}
          <span className="font-semibold text-[var(--color-primary-700)]">
            &quot;동&quot;
          </span>{" "}
          단위까지 입력해주세요. (예: 논현동, 부송동 등)
        </p>

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
        {!isLoading && (
          <>
            <p className="text-[1.8rem] mb-6">
              설정한 나의 동네:{" "}
              <span className="font-bold">{neighborhood}</span>
            </p>
            <div>
              <MapContainer lat={coords.lat} lng={coords.lng} />
            </div>
          </>
        )}
      </div>

      <footer className="mt-auto">
        <button
          className="font-bold h-[4rem] bg-[var(--color-primary-600)] p-4 w-full rounded-lg text-white cursor-pointer"
          onClick={() => goGetVerification(neighborhood, rcode)}
        >
          본인 인증하러 가기
        </button>
      </footer>
    </div>
  );
}

// ✅ Layout 적용 안 하도록 getLayout 설정
LocationPage.getLayout = function noLayout(page) {
  return page; // Layout 안 씌움
};
