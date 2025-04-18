import SearchLocationInput from "@/components/common/search-location";
import Layout from "@/components/layout/layout";
import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function LocationSearchPage() {
  const { currentUser, setNewLocation } = useCurrentUserStore();
  console.log("현재 유저 정보: ", currentUser);
  console.log(typeof currentUser?.id);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [recentLocations, setRecentLocations] = useState([]);

  // 페이지 최초 렌더링시, 서버로부터 유저의 recentLocations 정보 가져와서(GET 요청) 렌더링
  useEffect(() => {
    const fetchRecentLocations = async () => {
      try {
        const res = await fetch(`/api/user/locations?userId=${currentUser.id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setRecentLocations(data.recentLocations || []);
      } catch (err) {
        console.error("❌ 최근 위치 불러오기 실패:", err.message);
      }
    };

    if (currentUser?.id) {
      fetchRecentLocations();
    }
  }, [currentUser?.id]);

  const getMyLocation = () => {
    setIsLoading(true);
    // ✅ 1.5초간 인위적 로딩 시간
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;

          try {
            const res = await fetch(
              `/api/auth/kakao-geocode?lat=${latitude}&lng=${longitude}`
            );
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "서버 에러");

            setIsLoading(false); // 스피너 종료
            // setNeighborhood([data.sigungu, data.dong]);

            console.log("✅ 주소 '구':", data.sigungu);
            console.log("✅ 주소 '동':", data.dong);
            // console.log(neighborhood);
            // 🚨 setNeighborhood([data.sigungu, data.dong]) 호출 직후에는 neighborhood 상태가 아직 이전 값을 유지... (∵ useState의 세터함수는 비동기적으로 작동하므로 바로 아래서 컨솔을 찍으면 업데이트 전 값이 나옴! => ✨useEffect로 변경된 값을 감지해서 출력하면 제대로 업데이트된 값을 알 수 있다.)

            const fullAddress = [data.sigungu, data.dong].join(" ");

            // 서버에 PUT요청으로 유저의 location 값 fullAddress로 변경 (근데, IsVerified: true여야함! -> 여기서 객체를 만들어야할까? -> 일단 아래처럼 만듦 .. recentLocation이랑 똑같이..근데 배열이 아니라, 단일 객체이므로 그냥 newItem만 넘긴다.)
            const keyword = fullAddress.split(" "); // 인천시 계양구 계산동 -> [계양구, 계산동]
            const newItem = {
              id: Date.now(),
              keyword,
              isVerified: true,
            };
            updateLocationOnServer(newItem);
            console.log("❗️업데이트된 location 객체: ", newItem);
            // router.back();
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

  const renderAddressList = (areas) =>
    areas.map((area, index) => (
      <li key={index} role="presentation">
        <Link href="/" className="text-[1.6rem] cursor-pointer">
          {area}
        </Link>
      </li>
    ));

  // 다음 함수는 검색창에서 주소리스트 <li>클릭할 때 onClick 이벤트 함수로 설정!
  const saveRecentLocationsToServer = async (fullAddress) => {
    const keyword = fullAddress.split(" ").slice(-2); // 인천시 계양구 계산동 -> [계양구, 계산동]
    const newItem = {
      id: Date.now(),
      keyword,
      isVerified: false,
    };

    // ✨newList라는 최신 배열을 직접 만들어서✨
    // 1. 클라이언트 측 상태값을 이걸로 변경하고 => setRecentLocations(newList)
    // 2. 서버에 보낼 최신 데이터도 이걸로 보내자 =>  recentLocations: newList,
    const newList = (() => {
      const exists = recentLocations.some(
        (loc) => loc.keyword.join() === keyword.join()
      );
      if (exists) return recentLocations;
      return [...recentLocations, newItem].slice(-3);
    })();

    // ✅ 컴포넌트(클라이언트) 상태 먼저 업데이트
    setRecentLocations(newList);
    // ✅ 이거 중요!
    setNewLocation(newItem); // 🔥 zustand currentUser.location 업데이트

    // ✅ 그 다음 최신 데이터(newList)를 서버에 전송
    try {
      const res = await fetch("/api/user/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          recentLocations: newList, // ✅ 업데이트된 상태값 직접 전송 ... 그렇지 않고 그냥 recentLocations(useState값)을 보내버리면 🔥아무리 setRecentLocations로 상태변경 했어도 이 시점에서는 업데이트 이전 값을 기억하기 때문에🔥 아직 업데이트되지 못한 상태값이 서버에 전송되어짐!
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      console.log("✅ 최근 위치 저장 성공");
    } catch (err) {
      console.error("❌ 최근 위치 저장 실패:", err.message);
    }
  };

  const updateLocationOnServer = async (newLocation) => {
    try {
      const res = await fetch("/api/user/locations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          location: newLocation,
        }),
      });

      setNewLocation(newLocation);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log("✅ 현재 위치 수정 완료:", data.message);
    } catch (err) {
      console.error("❌ 위치 수정 실패:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-2 bg-[var(--color-bg)]">
      <div className="grid grid-cols-3 items-center p-4 font-bold border-b border-[var(--color-grey-200)]">
        <button
          className="justify-self-start cursor-pointer"
          onClick={() => router.back()}
        >
          <Image
            src="/icons/chevron-left.svg"
            alt="back-icon"
            width={28}
            height={28}
          />
        </button>
        <h1 className="text-center text-[2rem]">지역 검색</h1>
        <div /> {/* 오른쪽 공간 채우기용 빈 div */}
      </div>
      <div className="flex gap-6 p-4">
        {/* <input
          className="flex-grow bg-[var(--color-grey-100)] rounded-full p-4 text-[1.4rem]"
          placeholder='정확한 검색결과를 위해 반드시 "동" 단위로 입력하세요.'
        /> */}

        <SearchLocationInput
          onSelect={(fullAddress) => saveRecentLocationsToServer(fullAddress)}
          setIsLoading={setIsLoading}
        />
        <button className="cursor-pointer">
          <Image
            src="/icons/search.svg"
            alt="search-icon"
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="mx-4">
        <div className="flex flex-col gap-6 text-[1.4rem]">
          <div className="py-4 text-[var(--color-primary-600)] font-medium cursor-pointer">
            <button
              className="flex gap-1 items-center cursor-pointer"
              onClick={getMyLocation}
            >
              <Image
                src="/icons/globe-blue.svg"
                alt="icon"
                width={20}
                height={20}
              />
              <span>내 위치</span>
              {isLoading && (
                <ClipLoader
                  color={"#2563eb"} // 파란색 (Tailwind 기준 var(--color-primary-500))
                  size={20}
                  speedMultiplier={1}
                />
              )}
            </button>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="py-4 text-[var(--color-grey-400)]">
                우리동네
              </span>
              <Image
                src="/icons/check-badge.svg"
                alt="icon"
                width={18}
                height={18}
              />
            </div>

            <ul role="listbox">
              <li role="presentation">
                <Link href="/" className="text-[1.6rem] cursor-pointer">
                  {currentUser?.location?.keyword?.join(" ") || ""}
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <span className="py-4 text-[var(--color-grey-400)]">
              최근 이용 지역
            </span>
            <ul role="listbox">{renderAddressList(recentLocations)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
LocationSearchPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>; // Layout 안 씌움
};
