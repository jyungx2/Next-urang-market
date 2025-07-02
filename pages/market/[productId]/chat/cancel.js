import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PaymentCancelPage() {
  const router = useRouter();
  const { productId } = router.query;

  useEffect(() => {
    if (!productId) return;
    console.log("🔥 채팅페이지로 돌아가는중...");

    // 채팅페이지로 바로 리다이렉트
    router.replace({
      pathname: `/market/${productId}/chat`,
    });
  });
}
