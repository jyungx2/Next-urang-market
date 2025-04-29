import useCurrentUserStore from "@/zustand/currentUserStore";
import { useRouter } from "next/router";
import { useState } from "react";
import { PuffLoader } from "react-spinners";

export default function CommunityAddPost() {
  const router = useRouter();
  const { currentUser } = useCurrentUserStore();
  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [neighborhood, setNeighborhood] = useState("");
  const [rcode, setRcode] = useState("");

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
            setNeighborhood(data.dong); // "현재 위치: 계산동"으로 표시할 거기 때문에 regionName이 아닌 '동'만 추출!
            setRcode(data.rcode);

            // ✅ 위치 비교 후 바로 라우팅
            // setNeighborhood(비동기 상태 업데이트) 직후에 neighborhood 값을 바로 읽으면 갱신되지 않을 수 있으므로, neighborhood보다 data.dong으로 비교하는게 안전!
            if (
              currentUser?.selectedLocation.keyword.slice(-1)[0] === data.dong
            ) {
              router.push("/community/post/new");
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

  console.log(currentUser?.selectedLocation.keyword.slice(-1)[0]);
  console.log(
    currentUser?.selectedLocation.keyword.slice(-1)[0] === neighborhood
  );

  return (
    <>
      {/* Post 버튼: 오른쪽 아래 고정 */}
      <div className="relative max-w-[640px]">
        <button
          className="absolute top-106 right-10 bg-[var(--color-secondary-600)] rounded-full py-4 px-6 text-white font-bold cursor-pointer hover:bg-[var(--color-secondary-300)] shadow-lg"
          onClick={handlePostClick}
        >
          + Post
        </button>
      </div>

      {/* 모달: 화면 정가운데 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md text-center relative">
            {/* 닫기 버튼 */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            {/* 제목 */}
            <h2 className="text-2xl font-bold mb-4">우리동네 추가하기</h2>

            {/* 설명 */}
            {isLoading ? (
              <div className="flex justify-center items-center flex-col gap-4">
                <p>현재 위치를 찾고 있어요</p>
                <PuffLoader />
              </div>
            ) : (
              <p className="text-gray-600 mb-6 text-[1.4rem]">
                글을 작성하려면 현위치를 확인해서 <br />
                우리동네로 추가해주세요
              </p>
            )}
            {/* 현 위치로 동네 추가 버튼 */}
            <button
              className="bg-green-100 text-green-700 font-semibold py-3 px-5 rounded-lg w-full hover:bg-green-200 transition mt-4"
              onClick={() => {
                getMyLocation();
              }}
            >
              현 위치로 동네 추가 ➕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
