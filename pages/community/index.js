import { useEffect } from "react";
import { useRouter } from "next/router";
import useCurrentUserStore from "@/zustand/currentUserStore";

export default function CommunityRedirect() {
  const router = useRouter();
  const { currentUser } = useCurrentUserStore();

  useEffect(() => {
    const rcode =
      currentUser?.selectedLocation?.rcode || currentUser?.location?.rcode;

    if (!rcode) return;

    console.log("🔥 라우팅 시도 중...");
    router.replace({
      pathname: "/community/notice",
      query: { rcode },
    });
  }, [currentUser]);

  return <p className="text-center mt-20 text-gray-500">로딩 중...</p>;
}
