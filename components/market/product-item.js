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
    <>
      <Image src={productImage} alt="image" width={120} height={120} />
      <div className="flex flex-col gap-2 grow basis-0 min-w-0">
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

        <p className="text-[1.6rem]">
          {location} · {createdAt.split("T")[0]}
        </p>
        <p className="font-bold text-3xl">
          {type === "Sale" ? `${price}원` : "무료나눔"}
        </p>
        <div className="flex gap-4 ml-auto mt-auto">
          <button className="flex items-center gap-1 cursor-pointer">
            <Image src="/icons/chat.svg" alt="icons" width={28} height={28} />
            <span>{chatNum}</span>
          </button>
          <button className="flex items-center cursor-pointer">
            <Image src="/icons/heart.svg" alt="icons" width={28} height={28} />
            <span>{likeNum}</span>
          </button>
        </div>
      </div>
    </>
  );
}
