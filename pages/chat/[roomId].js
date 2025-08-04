import Layout from "@/components/layout/layout";
import SocketClient from "@/components/market/socket-client";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ChatDetailPage() {
  const router = useRouter();
  console.log("CSR: router: ", router);
  const { roomId } = router.query;
  const { currentUser } = useCurrentUserStore();

  const { data: chatRoom } = useQuery({
    queryKey: ["chatDetail", roomId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${roomId}`);
      const data = await res.json();
      console.log("채팅방 상세 정보: ", data.chatDetail);
      return data.chatDetail;
    },
    enabled: !!roomId, // roomId가 있을 때만 요청
  });

  const handleStripePayment = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          buyerId,
          price: chatRoom?.price,
          productName: chatRoom?.productTitle,
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("결제 에러:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex flex-col">
        <div className="flex justify-center items-center relative p-4">
          <button
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 p-4"
            onClick={() => router.back()}
          >
            <Image
              src="/icons/chevron-left.svg"
              alt="icon"
              width={30}
              height={30}
            />
          </button>
          <div className="flex flex-col justify-center items-center py-3">
            <span className="font-bold text-2xl">
              {currentUser?.id === chatRoom?.buyerId
                ? chatRoom?.sellerNickname
                : chatRoom?.buyerNickname}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-gray-300 p-4 bg-gray-200">
          <div className="flex gap-4 cursor-pointer">
            <div className="relative w-[48px] aspect-square">
              {chatRoom?.productThumbnail && (
                <Image
                  src={chatRoom?.productThumbnail}
                  alt="icon"
                  fill
                  className="rounded-xl"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span>Active</span>
              <span>{chatRoom?.price}원</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="flex gap-2 items-center h-fit p-2 border rounded-xl cursor-pointer"
              onClick={handleStripePayment}
            >
              <Image
                src="/icons/currency-dollar.svg"
                alt="purchase"
                height={24}
                width={24}
              />
              <span>카드결제</span>
            </button>
            <button className="flex gap-2 items-center h-fit p-2 border rounded-xl cursor-pointer">
              <Image
                src="/icons/currency-dollar.svg"
                alt="purchase"
                height={24}
                width={24}
              />
              <span>현금결제</span>
            </button>
          </div>
        </div>
      </header>

      {router.isReady && chatRoom?.productId && chatRoom?.buyerId && (
        <SocketClient roomId={roomId} buyerId={chatRoom?.buyerId} />
      )}
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ChatDetailPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>; // Layout 안 씌움
};
