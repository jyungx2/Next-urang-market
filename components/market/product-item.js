import Image from "next/image";

export default function ProductItem({
  productImage,
  title,
  location,
  createdAt,
  price,
  type,
  chatNum = 2,
  likeNum = 2,
}) {
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
              <span>{chatNum}</span>
            </button>
            <button className="flex items-center cursor-pointer">
              <Image
                src="/icons/heart.svg"
                alt="icons"
                width={28}
                height={28}
              />
              <span>{likeNum}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
