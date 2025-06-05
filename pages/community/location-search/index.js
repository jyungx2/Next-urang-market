import SearchLocationInput from "@/components/common/search-location-input";
import Layout from "@/components/layout/layout";
import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function LocationSearchPage() {
  const {
    currentUser,
    setCurrentUser,
    setNewLocation,
    setRecentLocations,
    setSelectedLocation,
  } = useCurrentUserStore();

  console.log("현재 유저 정보: ", currentUser);
  console.log(typeof currentUser?.id);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // const [recentLocations, setRecentLocations] = useState([]);

  // ⭐️ SearchLocationInput 리팩토링 ⭐️
  const [searchResults, setSearchResults] = useState([]);
  const addressRef = useRef();

  // 🎯 페이지 최초 렌더링시, 서버로부터 유저의 recentLocations 정보 가져와서(GET 요청) 렌더링
  useEffect(() => {
    const fetchRecentLocations = async () => {
      try {
        const res = await fetch(
          `/api/user/recent-locations?userId=${currentUser.id}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        console.log(
          "🧩 서버로부터 가져온 recentLocations:",
          data.recentLocations
        );
        setRecentLocations(data.recentLocations ?? []);

        console.log("최근 위치 가져오기 성공!", data.recentLocations);
      } catch (err) {
        console.error("❌ 최근 위치 불러오기 실패:", err.message);
      }
    };

    if (currentUser?.id) {
      fetchRecentLocations();
    }
  }, [currentUser?.id, setRecentLocations]);

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
            updateLocationOverall(newItem);
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

  const deleteRecentLocation = async (targetId) => {
    const updatedList = currentUser?.recentLocations?.filter(
      (loc) => loc.id !== targetId
    );

    // Zustand 상태 업데이트 (불변성 유지!)
    setRecentLocations(updatedList);
    setCurrentUser({ ...currentUser, recentLocations: updatedList });

    try {
      // ✅ 서버에도 반영하고 싶다면 PATCH/PUT 요청 추가 가능
      const res = await fetch(
        `/api/user/recent-locations?userId=${currentUser.id}&locationId=${targetId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   userId: currentUser?.id,
          //   locationIdToRemove: targetId,
          // }),
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      console.log("최근 지역 삭제 성공 ✅", data.message);
      console.log(
        "🔥 삭제된 최근 지역",
        currentUser.recentLocations.find((location) => location.id === targetId)
      );
    } catch (err) {
      console.log("최근 지역 삭제 실패 💥", err.message);
    }
  };

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
          onClick={() => changeSelectedLocationOverall(location)}
        >
          {location.keyword.slice(-2).join(" ")}
        </div>
        <button onClick={() => deleteRecentLocation(location.id)}>
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
      currentUser?.location?.isVerified === true &&
      currentUser?.location?.keyword?.length === keyword.length &&
      currentUser?.location?.keyword?.every((item, i) => item === keyword[i]);

    const location = {
      id: Date.now(),
      keyword, // EX: ['서울특별시', '종로구', '청운동']
      isVerified: isVerifiedCheck,
      rcode, // 별도의 api요청 없이, search-location.js으로부터 직접 받은 rcode 인자 사용
    };

    // ✅ CLIENT 측 selectedLocation 업데이트
    setSelectedLocation(location); // Zustand 상태 업데이트

    // ✅ SERVER 측 selectedLocation 업데이트
    changeSelectedLocationOverall(location);

    // 🔥 유저가 직접 검색하고 난 뒤에는 최근이용지역에 반영 필수
    // ✅ CLIENT & SERVER 측 recentLocations 상태 업데이트
    updateRecentLocationsOverall(location);

    // ⭐️ 부모 컴포넌트에서 처리하는 부가적인 작업(이전 페이지에서 정돈되어야 하는 것들.. -> 근데 딱히 없어도 되지 않나? 싶음.. 바로 다른 페이지(/community)로 이동하면...)
    setTimeout(() => {
      if (addressRef.current) addressRef.current.value = "";
      setSearchResults([]);
    }, 0);
  };

  // 🎯 recentLocations 상태 관리 코드 (C + S)
  const updateRecentLocationsOverall = async (location) => {
    const newRecentAddress = location;
    // ✨newList라는 최신 배열을 직접 만들어서✨
    // 1. 클라이언트 측 상태값을 이걸로 변경하고 => setRecentLocations(newList)
    // 2. 서버에 보낼 최신 데이터도 이걸로 보내자 =>  recentLocations: newList,
    const newRecentList = (() => {
      const exists = currentUser?.recentLocations?.some(
        (loc) => loc.keyword.join() === newRecentAddress.keyword.join()
      );
      if (exists) return currentUser?.recentLocations;
      return [...currentUser?.recentLocations, newRecentAddress].slice(-3); // push(): 기존 배열을 직접 수정해버려서 리액트나 zustand는 값이 안바꼈다고 판단.. 업데이트 무시 & 렌더링 x => [...]으로 아예 새로운 배열을 만들어 새로운 참조값을 만들어 렌더링 정상 동작 하도록 불변성 유지하는 방식으로 상태 업데이트! (📍불변성 유지 = 원래 값을 직접 수정 하지 않고, 새로운 값을 만들어서 교체하는 것)
    })();

    // ✅ CLIENT 측 recentLocations 업데이트
    setRecentLocations(newRecentList); // ❓ 아래에서 recentLocations를 바꿔줬으니까 굳이 여기서 해줄 필요 없는거 아닌가?

    // 💥⚠️객체 전체를 갱신해줄 필요⚠️💥
    setCurrentUser({ ...currentUser, recentLocations: newRecentList });
    // 위의 코드를 써주지 않으면, zustand는 상태가 변경되었는지 판단할 때, === 비교만 하기 때문에, 내부 속성(recentLocations 배열값)이 바뀌어도 currentUser 객체 자체가 동일하다면 React는 렌더링을 다시 하지 않으므로, currentUser 객체가 얕은 비교로 변경되지 않았다고 판단하여 렌더링을 다시 하지 x -> 아무리 setRecentLocations로 배열을 newList를 추가해 업데이트해줘도, 화면 상에 렌더링 되지 않음!
    // => 따라서, currentUser 자체를 업데이트해줌으로써 깊은 복사를 통해 currentUser 객체의 참조 자체를 바꿔주어 zustand가 변경 사항을 감지하고 리렌더링하도록 한다.

    // ⚠️ GPS로 인증한 위치만 location으로 등록할건지, 아니면 그냥 사용자가 단순히 현재 선택한, 인증되지 않은 위치도 location으로 등록할건지...=> 우리동네 = location이기 떄문에 내위치(GPS) 버튼 결과값만 location으로 등록되도록 하자! => 따라서 아래 코드는 지워야함..
    // setNewLocation(newItem); // 🔥 zustand currentUser.location 업데이트

    // ✅ SERVER 측 recentLocations 업데이트
    try {
      const res = await fetch(`/api/user/recent-locations`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          recentLocation: newRecentAddress,
          //  // ✅ 업데이트된 상태값 직접 전송 ... 그렇지 않고 그냥 recentLocations(useState값)을 보내버리면 🔥아무리 setRecentLocations로 상태변경 했어도 이 시점에서는 업데이트 이전 값을 기억하기 때문에🔥 아직 업데이트되지 못한 상태값이 서버에 전송되어짐!
          //   // 📌 api routes파일에서 PATCH 요청으로 $push, $each 메소드 이용해 요소 하나씩 받아서 recentLocations: [] 빈 배열에 넣는 방식이므로 newList가 아닌, newItem을 전달.. (250423 - 노션필기참고)
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      console.log("✅ 최근 위치 저장 성공");
    } catch (err) {
      console.error("❌ 최근 위치 저장 실패:", err.message);
    }
  };

  // 🎯 location 상태 관리 코드 (C + S)
  const updateLocationOverall = async (newLocation) => {
    try {
      // ✅ SERVER 측 location 업데이트
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

      // ✅ CLIENT 측 location 업데이트
      setNewLocation(newLocation);

      // 🔥내위치 바꾸면, 선택된 위치도 같이 바꿔줘야 한다! (그 반대는 x)
      // ✅ CLIENT & SERVER 측 selectedLocation 업데이트
      changeSelectedLocationOverall(newLocation);
      // +post 버튼 추가시 별도의 인증절차 거치지 않도록 isVerified === true로 바뀐 주소객체로 상태 변경

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      console.log("✅ 현재 위치 수정 완료:", data.message);
    } catch (err) {
      console.error("❌ 위치 수정 실패:", err.message);
    }
  };

  // 🎯 selectedLocations 상태 관리 코드 (C + S)
  const changeSelectedLocationOverall = async (selectedLocation) => {
    try {
      // ✅ SERVER 측 selectedLocation 업데이트
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

      // ✅ CLIENT 측 selectedLocation 업데이트
      setSelectedLocation(selectedLocation);

      // 해당 주소에 맞는 게시글 목록을 담은 페이지로 이동 (✨쿼리스트링 rcode 추가)
      // 📍상태 변경 직후 바로 상태값을 사용하는 건 위험함 (selectedLocation은 아직 이전 값일 수 있음)
      // > 현재 최신 주소 객체(newLocation)를 이미 갖고 있으므로, 거기서 rcode를 직접 꺼내서 사용해야 함
      // > 상태 업데이트(setSelectedLocation)와 라우팅(router.push)가 동시에 필요한 상황에선 상태값을 참조하지 말고, 직접 넘길 것!
      router.push({
        pathname: `/community/${router.query.from}`,
        query: { rcode: selectedLocation.rcode }, // currentUser?.selectedLocation?.rcode ==> 아직 변경(업데이트)되지 않은 Old value.. -> 두번째 클릭 때서야(?) 업데이트된 값 반영됨
      });

      console.log("✅ 현재 선택한 위치 변경 완료:", data.message);
    } catch (err) {
      console.error("❌ 현재 선택한 위치 변경 실패:", err.message);
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
        <SearchLocationInput
          onSelect={(fullAddress, rcode) =>
            handleSelectAddress(fullAddress, rcode)
          }
          setIsLoading={setIsLoading}
          addressRef={addressRef}
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
                  changeSelectedLocationOverall(currentUser?.location)
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
              {renderRecentAddress(currentUser?.recentLocations)}
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
