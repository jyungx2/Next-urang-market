import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { PuffLoader } from "react-spinners";

export default function AddPostModal({
  neighborhood,
  setNeighborhood,
  isLoading,
  setIsLoading,
  isLocationMatched,
  setIsLocationMatched,
  setShowModal,
}) {
  const { currentUser, setSelectedLocation } = useCurrentUserStore();
  const router = useRouter();

  const currentDong = neighborhood?.keyword?.slice(-1)[0];

  const goToSeeMyNeighborhood = async () => {
    setShowModal(false);

    // ✅ CLIENT 측 selectedLocation 업데이트
    setSelectedLocation(neighborhood);

    // ✅ SERVER 측 selectedLocation 업데이트
    const res = await fetch("/api/user/selected-location", {
      method: "PATCH",
      body: JSON.stringify({
        userId: currentUser.id,
        selectedLocation: neighborhood,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "서버 에러");
    console.log(
      "💌 내 이웃소식 보러가기 누른 후 api 요청 성공 시 받는 데이터: : ",
      data
    );

    if (router.query.mainCategory) {
      router.push({
        pathname: `/community/${router.query.mainCategory}`,
        query: { rcode: neighborhood.rcode },
      });
    } else {
      router.push({
        pathname: `/market`,
        query: { rcode: neighborhood.rcode },
      });
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
              currentUser?.selectedLocation.keyword[1] === data.sigungu &&
              currentUser?.selectedLocation.keyword[2] === data.dong
            ) {
              // ✅ CLIENT SIDE: selectedLocation 업데이트
              setSelectedLocation(addressObj); // 현재 위치와 유저가 선택한 위치가 일치하면 전역상태 selectedLocation 값도 반영해서 이후의 요청에 대해서는 isVerified === true에 의해 별도의 인증절차 거치지 않도록..

              // ✅ SEVER SIDE: selectedLocation 업데이트
              const res = await fetch("/api/user/selected-location", {
                method: "PATCH",
                body: JSON.stringify({
                  userId: currentUser.id,
                  selectedLocation: addressObj,
                }),
                headers: { "Content-Type": "application/json" },
              });
              const data = await res.json();
              console.log(
                "📀 내 위치 인증 성공시, 서버에 선택위치 값 업데이트: ",
                data
              );

              console.log(
                "2️⃣ 업데이트 직후 선택된 위치: ",
                currentUser.location,
                currentUser.selectedLocation
              );

              // 📖 위치 인증 성공했으므로 글작성 페이지로 이동
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
              현재 위치 : {currentDong}
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
              onClick={() => goToSeeMyNeighborhood()}
            >
              {currentDong} 이웃소식 보러가기
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
  );
}
