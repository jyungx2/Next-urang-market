// pages/community/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CommunityRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 첫번째 메인 카테고리로 바로 이동
    router.replace("/community/notice");
  }, []);

  return null; // 혹은 로딩 표시
}
