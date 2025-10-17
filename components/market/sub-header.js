import UIContext from "@/store/ui-context";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function SubHeader() {
  const { toggleSidebar, toggleSearchPage, toggleNotificationPage } =
    useContext(UIContext);

  const { currentUser, setSelectedLocation } = useCurrentUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const showRecentAddresses = () => {
    setIsOpen((prev) => !prev); // isOpen이 이전에 이미 바뀌었을 수도 있고 아직 반영되지 않았을 수도 있어서 최신 상태를 기준으로 반영되지 않을 수 있기 때문에, 항상 최신 값을 기준으로 계산되게 하기 위한 함수형 업데이트 방식을 쓰는 게 React 공식 권장 방식
  };

  const changeSelectedLocation = useMutation({
    mutationFn: async (selectedLocation) => {
      // 1) 서버 요청만 담당 (throw/return만)
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

      if (!res.ok) {
        // 서버 메시지 안전 파싱
        let msg = data?.message || `${res.status} ${res.statusText}`;
        throw new Error(msg); // ← 반드시 던져야 onError로 감
      }

      return data; // => onSuccess의 첫 번째 인자(data)로 전달
    },
    // 2) 성공 후에만 클라이언트 상태 확정 + 라우팅 + 캐시 무효화
    onSuccess: async (data, selectedLocation) => {
      // ✅ 서버 요청 성공 후, CLIENT 측 selectedLocation 업데이트
      setSelectedLocation(selectedLocation);

      // 유저가 선택한 지역 코드(rcode)에 해당하는 상품 목록 페이지로 이동
      router.push({
        pathname: "/market",
        query: { rcode: selectedLocation.rcode },
      });

      // 상품 목록 캐시 무효화 -> refetch
      queryClient.invalidateQueries(["products"]);
      console.log("✅ 현재 선택한 위치 변경 완료:", data.message);
    },
    onError: (err) => {
      // err.message: mutationFn에서 던진 에러 메시지 = "msg" 변수
      // new Error(<첫 번째 인자>)의 첫 번째 인자 값이 Error 인스턴스의 .message 프로퍼티로 설정됩니다. => 프로퍼티 이름은 항상 .message로 고정
      console.error("❌ 현재 선택한 위치 변경 실패:", err?.message);
      alert(err?.message || "요청 중 오류가 발생했어요.");
    },
  });

  const [isInputOpen, setIsInputOpen] = useState(false);
  const showSearchInput = () => {
    setIsInputOpen((prev) => !prev);
  };

  return (
    <div className="flex sticky top-0 py-8 bg-[var(--color-bg)]">
      <button
        className="flex items-center gap-1 cursor-pointer relative text-4xl font-bold"
        onClick={showRecentAddresses}
      >
        <span>{currentUser?.selectedLocation?.keyword.slice(-1)}</span>
        <Image
          src="/icons/chevron-down.svg"
          alt="image"
          width={24}
          height={24}
        />

        <div
          className={`absolute left-0 top-10  transition-all duration-300 ease-in-out min-w-[8rem]  ${
            isOpen
              ? "opacity-100 translate-y-5"
              : "opacity-0 translate-y-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col bg-[var(--color-primary-200)] p-4 rounded-2xl gap-5">
            {currentUser?.recentLocations.length === 0 ? (
              <div></div>
            ) : (
              currentUser?.recentLocations?.map((address) => (
                <li
                  key={address.id}
                  className="list-none text-[1.6rem] cursor-pointer mr-auto"
                  onClick={() => changeSelectedLocation.mutate(address)}
                >
                  {address.keyword.slice(-1)}
                </li>
              ))
            )}
          </div>
        </div>
      </button>

      <div
        className={`flex-grow mx-4 transition-all duration-300 ease-in-out transform text-[1.8rem] border rounded-lg ${
          isInputOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-15 opacity-0 pointer-events-none"
        }`}
        onClick={toggleSearchPage}
      >
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="inputUnset inputCustom w-full p-2 border rounded "
        />
      </div>

      <div className="flex ml-auto gap-6">
        <button className="cursor-pointer" onClick={toggleSidebar}>
          <Image src="/icons/menu.svg" alt="menu-icon" width={28} height={28} />
        </button>
        <button className="cursor-pointer" onClick={showSearchInput}>
          <Image
            src="/icons/search.svg"
            alt="menu-icon"
            width={28}
            height={28}
          />
        </button>
        <button className="cursor-pointer" onClick={toggleNotificationPage}>
          <Image
            src="/icons/alarm.svg"
            alt="menu-icon"
            width={28}
            height={28}
          />
        </button>
      </div>
    </div>
  );
}
