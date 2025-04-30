import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { PuffLoader } from "react-spinners";

export default function CommunityAddPost() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLocationMatched, setIsLocationMatched] = useState(null); // null, true, false

  const [neighborhood, setNeighborhood] = useState("");
  const { currentUser, setSelectedLocation } = useCurrentUserStore();

  const handlePostClick = () => {
    if (currentUser?.selectedLocation?.isVerified === false) {
      setShowModal(true);
    } else {
      router.push("/community/post/new");
    }
  };

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
            console.log(data.regionName);
            const keyword = data.regionName.split(" ");
            const addressObj = {
              id: Date.now(),
              keyword,
              isVerified: true, // GPS에 의해 위치인증 거쳤으므로 true
              rcode: data.rcode,
            };

            setNeighborhood(addressObj); // ✅ 조건문 불만족 시, "현재 위치: 계산동"으로 표시할 값(keyword)이 담겨있는 객체 저장

            // ✅ 위치 비교 후 바로 라우팅
            // setNeighborhood(비동기 상태 업데이트) 직후에 neighborhood 값을 바로 읽으면 갱신되지 않을 수 있으므로, neighborhood보다 data.dong으로 비교하는게 안전!
            if (
              currentUser?.selectedLocation.keyword.slice(-1)[0] === data.dong
            ) {
              router.push("/community/post/new");
            } else {
              setIsLocationMatched(false); // 매칭 실패 상태로 변경
            }

            console.log("✅ 위치 표시 완료:", data.dong);
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

  return (
    <>
      {/* +POST 버튼의 배경이 되는 역할: 스크롤에도 고정되며, max-w-[640px] 안에서 가운데 정렬(fixed의 경우, 부모가 뷰포트 기준이므로 mx-auto로는 가운데 정렬 불가능..=> block 요소+부모가 너비를 제한할 때만 가능한 속성, mx-auto를 못 쓰는 상황에서 수평 중앙 정렬을 하기 위한 대체 방법을 썼다.) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[640px] px-4 bg-amber-200">
        {/* relative: 버튼 absolute 위치의 기준이 되는 부모 */}
        <div className="relative">
          {/* absolute: relative 기준으로 오른쪽 아래에 버튼 배치되도록 right, bottom 속성 미세조정 */}
          <button
            className="absolute right-5 bottom-30 bg-[var(--color-secondary-600)] rounded-full py-6 px-8 text-white font-bold cursor-pointer hover:bg-[var(--color-secondary-300)] shadow-lg"
            onClick={handlePostClick}
          >
            + Post
          </button>
        </div>
      </div>

      {/* 모달: 화면 정가운데 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl py-10 px-6 w-[90%] max-w-md text-center relative">
            {/* 제목 */}
            {!neighborhood && (
              <h2 className="text-3xl font-bold mb-4">우리동네 추가하기</h2>
            )}
            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* 설명 */}
            {isLoading ? (
              <div className="flex justify-center items-center flex-col gap-4">
                <p>현재 위치를 찾고 있어요</p>
                <PuffLoader />
              </div>
            ) : isLocationMatched === false ? (
              <>
                <p className="text-red-500 font-bold mb-2 text-[1.8rem]">
                  현재 위치 : {neighborhood.keyword.slice(-1)[0]}
                </p>
                <p className="font-bold mb-4 text-[1.8rem]">
                  우리동네로 추가하지 못했어요.
                </p>
                <p className="text-gray-600 mb-6 text-[1.4rem]">
                  지금 이웃에서 보고 있는 지역과 <br />
                  현재 위치가 일치해야 합니다.
                </p>
                {/* 버튼 */}
                <button
                  className="bg-green-100 text-green-700 font-semibold py-5 rounded-xl w-full hover:bg-green-200 transition mt-4"
                  onClick={() => {
                    router.push({
                      pathname: `/community/${router.query.mainCategory}`,
                      query: { rcode: neighborhood.rcode },
                    });
                    setShowModal(false);
                    setSelectedLocation(neighborhood);
                  }}
                >
                  {neighborhood.keyword.slice(-1)[0]} 이웃소식 보러가기
                </button>
                <button
                  className="bg-gray-100 text-gray-700 font-semibold py-5 rounded-xl w-full hover:bg-gray-200 transition mt-4"
                  onClick={() => setShowModal(false)}
                >
                  닫기
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6 text-[1.4rem]">
                  글을 작성하려면 현위치를 확인해서 <br />
                  우리동네로 추가해주세요
                </p>

                {/* 현 위치로 동네 추가 버튼 */}
                <button
                  className="flex justify-center items-center gap-2 bg-green-100 text-green-700 font-semibold py-3 px-5 rounded-lg w-full hover:bg-green-200 transition mt-4 cursor-pointer"
                  onClick={() => {
                    getMyLocation();
                  }}
                >
                  <span>현 위치로 동네 추가</span>
                  <Image
                    src="/icons/my-location-g.svg"
                    alt="icon"
                    width={16}
                    height={16}
                  />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
