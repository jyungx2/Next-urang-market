import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useQueryClient } from "@tanstack/react-query";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { productId, buyerId } = router.query;
  const { currentUser } = useCurrentUserStore(); // 현재 사용자 정보 가져오기
  const socketRef = useRef(null); // ✅ socket 인스턴스를 ref에 저장
  const queryClient = useQueryClient();
  const roomId = `${productId}_${buyerId}`;

  useEffect(() => {
    if (!productId || !buyerId) return;

    // 1. socket 연결
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
    );

    // 2. 주문 상태 저장
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, buyerId }),
    });

    // 3. 채팅방 메시지 전송
    const localId = uuidv4();
    const newMessage = {
      localId,
      roomId: `${productId}_${buyerId}`,
      senderId: buyerId,
      text: `🎉 '${currentUser.username}'님이 방금 결제를 완료하였습니다!`,
      createdAt: new Date().toISOString(),
    };

    socketRef.current.emit("sendMessage", newMessage); // 서버에도 전송

    // 👉 클라이언트에서도 UX 위해 바로 반영하려면:
    queryClient.setQueryData(["messages", roomId], (old = []) => [
      ...old,
      newMessage,
    ]);

    // 4. 3초 후 채팅방으로 이동
    const timer = setTimeout(() => {
      router.replace(`/market/${productId}/chat`);
    }, 3000);

    // 5. 정리(cleanup)
    return () => {
      clearTimeout(timer);
      socketRef.current?.disconnect();
    };
  }, [productId, buyerId, router]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">🎉 결제 성공! 🎉</h1>
      <p>잠시후 채팅방으로 이동합니다...</p>
    </div>
  );
}
