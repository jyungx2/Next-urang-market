import useCurrentUserStore from "@/zustand/currentUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

export default function ProductItem({
  productId,
  productImage,
  title,
  location,
  createdAt,
  price,
  type,
  userHasWished,
  chatNum = 0,
  initialWishCount,
  chatRoomsCount = 0, // 채팅방 개수
}) {
  const queryClient = useQueryClient();

  const [hasWished, setHasWished] = useState(userHasWished);
  console.log("useHasWished:", userHasWished);
  const [wishCount, setWishCount] = useState(initialWishCount);
  const { currentUser } = useCurrentUserStore();
  console.log(currentUser, "currentUser in ProductItem");

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/products/wishlist`, {
        method: hasWished ? "DELETE" : "PUT", // PUT: 위시리스트에 추가, DELETE: 위시리스트에서 제거
        body: JSON.stringify({ productId }), // 실제 productId로 변경 필요
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "위시리스트 추가 실패");
      }

      const data = await res.json();
      setHasWished(data.userHasWished);
      setWishCount(data.wishCount);
      console.log("위시리스트 추가 성공:", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] }); // prefix 매칭으로 모두 무효화
    },
    onError: (error) => {
      console.error("위시리스트 반영 실패:", error);
      alert("위시리스트 반영에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return (
    // ❌부모 요소(<li>)가 명확한 너비가 없으면, 자식 입장에서 "남는 공간이 뭔지" 조차 계산이 안됨❌ => grow 무력화 => 최상위 플렉스 부모요소에 w-full로 명확한 너비 명시해야 함..
    <div className="flex w-full h-[120px] gap-4">
      {/* 이미지 */}
      <div className="relative z-0 w-[120px] aspect-square overflow-hidden rounded-2xl">
        <Image
          src={productImage}
          alt="image"
          fill
          className="object-cover"
          sizes="120px"
        />
      </div>

      {/* 텍스트 */}
      <div className="grow">
        <div className="flex flex-col h-full">
          <div className="flex justify-between">
            <h1 className="text-4xl">{title}</h1>
            <button className="cursor-pointer">
              <Image
                src="/icons/ellipsis-vertical.svg"
                alt="icon"
                width={24}
                height={24}
              />
            </button>
          </div>

          <div className="text-[1.6rem] mt-2">
            {location} · {createdAt.split("T")[0]}
          </div>
          <div className="font-bold text-3xl mt-2">
            {type === "Sale" ? `${price}원` : "무료나눔"}
          </div>

          <div className="flex gap-4 ml-auto mt-auto">
            <button className="flex items-center gap-1 cursor-pointer">
              <Image src="/icons/chat.svg" alt="icons" width={28} height={28} />
              <span>{chatRoomsCount}</span>
            </button>
            <button
              className="flex items-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                wishlistMutation.mutate();
              }}
            >
              <Image
                src={`${
                  hasWished ? "/icons/heart-filled.svg" : "/icons/heart.svg"
                }`}
                alt="icons"
                width={28}
                height={28}
              />
              <span>{wishCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
