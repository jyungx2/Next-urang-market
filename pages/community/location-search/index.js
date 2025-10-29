import SearchLocationInput from "@/components/common/search-location-input";
import Layout from "@/components/layout/layout";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function LocationSearchPage() {
  const {
    currentUser,
    setNewLocation,
    setRecentLocations,
    setSelectedLocation,
  } = useCurrentUserStore();

  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // ⭐️ SearchLocationInput 리팩토링 ⭐️
  const [searchResults, setSearchResults] = useState([]);

  // 🎯 페이지 최초 렌더링시, 서버로부터 유저의 recentLocations 정보 가져와서(GET 요청) 렌더링
  const {
    data: recentLocations,
    isError: isRecentError,
    error: recentError,
  } = useQuery({
    queryKey: ["recentLocations", currentUser?.id],
    queryFn: async () => {
      const res = await fetch(
        `/api/user/recent-locations?userId=${currentUser.id}`
      );
      const data = await res.json();
      setRecentLocations(data.recentLocations ?? []);

      console.log("최근 위치 가져오기 성공!", data);

      if (!res.ok) throw new Error(data.message);
      return data.recentLocations;
    },
    enabled: !!currentUser?.id, // userId 있을 때만
  });

  // 🎯 내위치 클릭 시, 현재 위치에 대한 인증절차를 통해 데이터를 받아와서 필요한 객체로 가공한 후, location 전역상태값으로 저장하는 상태관리코드
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

            // console.log("✅ 주소 풀네임", data.regionName);
            // console.log("✅ 주소 '구':", data.sigungu);
            // console.log("✅ 주소 '동':", data.dong);
            // console.log(neighborhood);
            // 🚨 setNeighborhood([data.sigungu, data.dong]) 호출 직후에는 neighborhood 상태가 아직 이전 값을 유지... (∵ useState의 세터함수는 비동기적으로 작동하므로 바로 아래서 컨솔을 찍으면 업데이트 전 값이 나옴! => ✨useEffect로 변경된 값을 감지해서 출력하면 제대로 업데이트된 값을 알 수 있다.)

            const fullAddress = data.regionName;
            const rcode = data.rcode;

            // 서버에 PUT요청으로 유저의 location 값 fullAddress로 변경 (근데, IsVerified: ✨true✨여야함! -> 여기서 객체를 만들어야할까? -> 일단 아래처럼 만듦 .. recentLocation이랑 똑같이..근데 배열이 아니라, 단일 객체이므로 그냥 newItem만 넘긴다.)
            const newItem = {
              id: Date.now(),
              keyword: fullAddress.split(" "),
              isVerified: true,
              rcode,
            };
            updateMyLocation(newItem);
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

  const deleteRecentLocation = useMutation({
    mutationFn: async (targetId) => {
      // ✅ SERVER 측 데이터 수정
      const res = await fetch(
        `/api/user/recent-locations?userId=${currentUser.id}&locationId=${targetId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data.recentLocations;
    },
    onSuccess: (serverData) => {
      console.log("❌ 최근 주소 삭제 후 리스트: ", serverData);
      // queryClient.invalidateQueries(["recentLocations", currentUser?.id]);
      queryClient.setQueryData(["recentLocations", currentUser.id], serverData);
      // setQueryData는 서버를 호출하지 않고 QueryCache의 데이터만 즉시 바꿈.
      // -> invalidateQueries와 다르게 네트워크 요청 X
      // 해당 queryKey를 구독 중인 useQuery 컴포넌트들이 캐시 변경 이벤트(notify)를 받고,
      // React Query가 새 데이터(= 2번째 인자값, 새 레퍼런스)를 useQuery 훅에 전달 → 리렌더 유발

      // ✅ CLIENT 측 zustand 상태 업데이트
      setRecentLocations(serverData);
    },
    onError: (err) => {
      console.error("💥최근 주소 삭제 중 에러 발생: ", err);
    },
  });

  // 🎨 유저가 검색한 주소에 대한 목록리스트 반환하는 UI 코드
  const renderRecentAddress = (recentLocations) => {
    console.log("최근 이용 지역 배열:", recentLocations);
    return recentLocations?.map((location, index) => (
      <li
        key={index}
        role="presentation"
        className="flex justify-between text-[1.6rem] mb-6"
      >
        <div
          className="cursor-pointer"
          onClick={() => updateSelectedLocation.mutate(location)}
        >
          {location?.keyword?.slice(-2).join(" ")}
        </div>
        <button onClick={() => deleteRecentLocation.mutate(location.id)}>
          <Image
            className="cursor-pointer"
            src="/icons/xbtn-bg.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
      </li>
    ));
  };

  // 🎯 법정동 주소 API로부터 받아온 주소값과 지역코드를 필요한 상태(location 객체)값으로 가공하는 코드
  // SearchLocationInput의 책임을 줄이고, 부모에서 모든 후처리를 담당 -> SearchLocationInput에서는 주소만 선택해서 넘기고, 부모 컴포넌트(LocationSearchPage)에서 이걸 받아 처리하는 방식
  const handleSelectAddress = async (fullAddress, rcode) => {
    console.log("onSelect에서 받는 매개변수: ", fullAddress, rcode);
    const keyword = fullAddress.split(" ");
    const sigungu = keyword.at(-2);
    const dong = keyword.at(-1);
    console.log("시군구, 동: ", sigungu, dong);

    const isVerifiedCheck =
      currentUser?.location?.isVerified === true && // 현재 유저 동네의 검증이 완료됐는지
      currentUser?.location?.keyword?.length === keyword.length && // 현재 유저 동네 키워드 길이가 같은지
      currentUser?.location?.keyword?.every((item, i) => item === keyword[i]); // 현재 유저 동네 키워드들이 다 일치한지

    const location = {
      id: Date.now(),
      keyword, // EX: ['서울특별시', '종로구', '청운동']
      isVerified: isVerifiedCheck,
      rcode, // 별도의 api요청 없이, search-location.js으로부터 직접 받은 rcode 인자 사용
    };

    // ✅ CLIENT & SERVER 측 selectedLocation 업데이트
    updateSelectedLocation.mutate(location);

    // 🔥 유저가 직접 검색하고 난 뒤에는 최근 이용 지역에 반영 필수
    // ✅ CLIENT & SERVER 측 recentLocations 상태 업데이트
    updateRecentLocations.mutate(location);

    // ⭐️ 부모 컴포넌트에서 처리하는 부가적인 작업(이전 페이지에서 정돈되어야 하는 것들.. -> 근데 딱히 없어도 되지 않나? 싶음.. 바로 다른 페이지(/community)로 이동하면...)
    // setTimeout(() => {
    //   if (addressRef.current) addressRef.current.value = "";
    //   setSearchResults([]);
    // }, 0);
  };

  // 🎯 recentLocations 상태 관리 코드 (C + S)
  const updateRecentLocations = useMutation({
    mutationFn: async (location) => {
      const res = await fetch(`/api/user/recent-locations`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          recentLocation: location,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    // 💯 SSOT (Single Source Of Truth: 서버가 말하는 것이 오직 진실)로 교체
    onSuccess: (serverData) => {
      const updatedData = serverData.selectedLocation;
      const successMsg = serverData.message;

      // ✅ SERVER 측에서 최종 변경한 데이터를 받아와서 네트워크 요청없이 오직 UI 변경만을 위한 캐시 변경
      queryClient.setQueryData(
        ["recentLocations", currentUser.id],
        updatedData
      );

      // ✅ CLIENT 측 zustand 상태 업데이트
      setRecentLocations(updatedData);

      console.log("✅ 최근 주소 목록 수정 완료:", successMsg);
    },
    onError: () => {
      console.error("💥최근 주소 추가 중 에러 발생: ", err);
    },
  });

  // 🎯 location 상태 관리 코드 (C + S)
  const updateMyLocation = useMutation({
    mutationFn: async (newLocation) => {
      const res = await fetch(`/api/user/location`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          location: newLocation,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    // 💯 SSOT (Single Source Of Truth: 서버가 말하는 것이 오직 진실)로 교체
    onSuccess: (serverData) => {
      const updatedData = serverData.location;
      const successMsg = serverData.message;

      // ✅ CLIENT 측 location 업데이트
      setNewLocation(updatedData);

      // 🔥 내 위치 바꾸면, 선택된 위치도 같이 바꿔줘야 한다! (그 반대는 x)
      // ✅ CLIENT & SERVER 측 selectedLocation 업데이트
      updateSelectedLocation.mutate(updatedData);

      console.log("✅ 현재 위치 수정 완료:", successMsg);
    },
    onError: (err) => {
      console.error("❌ 위치 수정 실패:", err.message);
    },
  });

  // 🎯 selectedLocations 상태 관리 코드 (C + S)
  const updateSelectedLocation = useMutation({
    mutationFn: async (selectedLocation) => {
      const res = await fetch(`/api/user/selected-location`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          selectedLocation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: (serverData) => {
      const updatedData = serverData.selectedLocation;
      const successMsg = serverData.message;

      // ✅ CLIENT 측 selectedLocation 업데이트
      setSelectedLocation(updatedData);

      router.push({
        pathname: `/community/${router.query.from}`,
        query: { rcode: updatedData.rcode }, // currentUser?.selectedLocation?.rcode ==> 아직 변경(업데이트)되지 않은 Old value.. -> 두번째 클릭 때서야(?) 업데이트된 값 반영됨
      });
      console.log("✅ 현재 선택한 위치 변경 완료:", successMsg);
    },
    onError: (err) => {
      console.error("❌ 현재 선택한 위치 변경 실패:", err.message);
    },
  });

  return (
    <div className="min-h-screen flex flex-col gap-2 bg-[var(--color-bg)] ">
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
        <SearchLocationInput
          onSelect={(fullAddress, rcode) =>
            handleSelectAddress(fullAddress, rcode)
          }
          setIsLoading={setIsLoading}
          // addressRef={addressRef}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
        />
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

            <div role="listbox">
              <div
                className="text-[1.6rem] cursor-pointer"
                onClick={() =>
                  updateSelectedLocation.mutate(currentUser?.location)
                }
              >
                {currentUser?.location.keyword.slice(-2).join(" ")}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="py-4 text-[var(--color-grey-400)]">
              최근 이용 지역
            </span>
            <ul role="listbox">
              {isRecentError ? (
                <div>
                  {recentError.message ||
                    "최근 주소 데이터를 가져오는 데 오류가 발생했습니다."}
                </div>
              ) : (
                renderRecentAddress(recentLocations)
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
LocationSearchPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
