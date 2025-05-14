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
      // 특정 rcode 페이지 이동
      router.push({
        pathname: "/market",
        query: { rcode: selectedLocation.rcode },
      });

      // ✅ CLIENT 측 selectedLocation 업데이트
      setSelectedLocation(selectedLocation);
      console.log("🔥", selectedLocation);

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

        // router.push({
        //   pathname: `/market/${router.query.from}`,
        //   query: { rcode: selectedLocation.rcode }, // currentUser?.selectedLocation?.rcode ==> 아직 변경(업데이트)되지 않은 Old value.. -> 두번째 클릭 때서야(?) 업데이트된 값 반영됨
        // });

        console.log("✅ 현재 선택한 위치 변경 완료:", data.message);
      } catch (err) {
        console.error("❌ 현재 선택한 위치 변경 실패:", err.message);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  // const changeSelectedLocation = async (selectedLocation) => {
  //   // ✅ CLIENT 측 selectedLocation 업데이트
  //   setSelectedLocation(selectedLocation);
  //   console.log("🔥", selectedLocation);

  //   try {
  //     // ✅ SERVER 측 selectedLocation 업데이트
  //     const res = await fetch(`/api/user/selected-location`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: currentUser.id,
  //         selectedLocation,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) throw new Error(data.message);

  //     // router.push({
  //     //   pathname: `/market/${router.query.from}`,
  //     //   query: { rcode: selectedLocation.rcode }, // currentUser?.selectedLocation?.rcode ==> 아직 변경(업데이트)되지 않은 Old value.. -> 두번째 클릭 때서야(?) 업데이트된 값 반영됨
  //     // });

  //     console.log("✅ 현재 선택한 위치 변경 완료:", data.message);
  //   } catch (err) {
  //     console.error("❌ 현재 선택한 위치 변경 실패:", err.message);
  //   }
  // };

  return (
    <div className="flex font-bold text-4xl sticky top-0 py-8 bg-[var(--color-bg)]">
      <button
        className="flex items-center gap-1 cursor-pointer relative"
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
          <div className="flex flex-col bg-[var(--color-primary-100)] p-4 rounded-2xl gap-5">
            {currentUser?.recentLocations.map((address) => (
              <li
                key={address.id}
                className="list-none text-[1.6rem] cursor-pointer mr-auto"
                onClick={() => changeSelectedLocation.mutate(address)}
              >
                {address.keyword.slice(-1)}
              </li>
            ))}
          </div>
        </div>
      </button>
      <div className="flex ml-auto gap-6">
        <button className="cursor-pointer" onClick={toggleSidebar}>
          <Image src="/icons/menu.svg" alt="menu-icon" width={28} height={28} />
        </button>
        <button className="cursor-pointer" onClick={toggleSearchPage}>
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
