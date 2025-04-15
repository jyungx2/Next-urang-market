import useUserStore from "@/zustand/userStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LocationPage() {
  const router = useRouter();

  const { setLocation } = useUserStore();

  useEffect(() => {
    // getCurrentPosition(): 브라우저에서 위치를 요청하는 "비동기 함수"
    // 📌 fetch()랑 아무 관계 없음
    // 📌 성공(실패)하면 → 성공(실패) 콜백 실행
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        try {
          const res = await fetch(
            `/api/auth/kakao-geocode?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();

          console.log("🔍 서버 응답 상태:", res.status);
          console.log("🔍 응답 데이터:", data);

          // API 서버 응답 실패, 인터넷 끊김, CORS 오류 등
          // fetch로 받아오는 경우, HTTP 에러 수동으로 throw 해야 함❗
          // ❗❗ 만약 아래 코드를 쓰지 않으면, 서버 응답이 500이더라도, catch도 없고 throw도 없어서 아무 일 없이 지나감 ❗❗
          if (!res.ok) {
            throw new Error(data.message || "서버 에러 발생");
          }

          setLocation(data.regionName);

          console.log("유저정보에 설정된 location: ", data.regionName);
        } catch (err) {
          console.error("❌ 위치 요청 실패:", err);
          alert(err.message || "위치 정보를 가져오는데 실패했습니다.");
        }
      },
      // ✅ 여기 err는 오직 위치 추적 자체가 실패했을 때만 들어옴 ( // ❌ fetch()가 실패해도 여긴 실행 안 됨)
      // 📌 위의 서버 api 요청(res)에 대해 !res.ok일 때, 서버에서 받은 에러 메시지를 반환하는 것과는 완전히 별개의 에러 처리 루트인 아래의 errorFn.
      // 📌 위치 추적 자체가 실패했을 때만 호출되므로 fetch() 요청 실패나 서버 응답 500번대 에러는 넘어가지 않고,,, Err의 원인: 위치 권한 거부, GPS 오류, 위치 추적 시간 초과
      (err) => {
        console.error("위치 에러:", err);
        alert("위치 권한을 해제해주세요. or 위치 추적 시간을 초과했습니다.");
      }
    );
  }, []);

  return (
    <div className="max-w-[640px] mx-auto min-h-screen bg-[var(--color-bg)] flex flex-col gap-8 p-4">
      <header className="grid grid-cols-3 items-center justify-center mb-4 border-b border-[var(--color-grey-100)] pb-4">
        <button
          onClick={() => router.back()}
          type="button"
          className="relative w-[30px] aspect-square cursor-pointer"
        >
          <Image
            src="/icons/xbtn.svg"
            alt="icon"
            fill
            className="cursor-pointer"
          />
        </button>
        <h1 className="font-bold text-[2.4rem] col-span-2">
          Identify verification
        </h1>
      </header>

      <p>위치 정보를 수집중입니다...</p>
    </div>
  );
}

// ✅ Layout 적용 안 하도록 getLayout 설정
LocationPage.getLayout = function noLayout(page) {
  return page; // Layout 안 씌움
};
