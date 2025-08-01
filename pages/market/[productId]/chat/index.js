import Layout from "@/components/layout/layout";
import Image from "next/image";
import { useRouter } from "next/router";
import SocketClient from "@/components/market/socket-client";
import useCurrentUserStore from "@/zustand/currentUserStore";
import useSelectedProductStore from "@/zustand/selectedProduct";

export default function ChatPage() {
  const router = useRouter();
  const { productId } = router.query;
  const { selectedProduct } = useSelectedProductStore();
  const { currentUser } = useCurrentUserStore();

  const buyerId = currentUser?.id;
  const sellerId = selectedProduct?.sellerId;
  console.log("CSR productId: ", selectedProduct);

  const handleStripePayment = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          buyerId,
          price: selectedProduct?.price,
          productName: selectedProduct?.title,
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
            onClick={() => router.push(`/market/${productId}`)}
          >
            <Image
              src="/icons/chevron-left.svg"
              alt="icon"
              width={30}
              height={30}
            />
          </button>
          <div className="flex flex-col justify-center items-center">
            <span className="font-bold text-2xl">
              {selectedProduct?.writer}
            </span>
            <span className="text-sm font-medium">
              Typically replies in 10 mins
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-gray-300 p-4 bg-gray-200">
          <div className="flex gap-4 cursor-pointer">
            <div className="relative w-[48px] aspect-square">
              <Image
                src={selectedProduct?.writerImage}
                alt="icon"
                fill
                className="rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span>Active</span>
              <span>{selectedProduct?.price}원</span>
            </div>
          </div>

          <div className="flex gap-4">
            {/* <button className="flex gap-2 items-center h-fit p-2 border rounded-lg">
              <Image
                src="/icons/calendar.svg"
                alt="set-meetup"
                height={24}
                width={24}
              />
              <span>Set meetup</span>
            </button> */}
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

      {router.isReady && productId && buyerId && (
        <SocketClient
          roomId={productId + "_" + sellerId + "_" + buyerId}
          buyerId={buyerId}
        />
      )}
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ChatPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
