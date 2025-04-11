import Image from "next/image";

export default function Activities() {
  return (
    <div className="gap-6 items-center p-6 rounded-2xl bg-[var(--color-primary-50)]">
      <h2 className="mb-6 font-bold text-[2rem]">Activity</h2>
      <div className="flex flex-col gap-6">
        <button className="font-medium cursor-pointer flex justify-between items-center">
          <span>즐겨찾기</span>
          <Image
            src="/icons/chevron-right.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
        <button className="font-medium cursor-pointer flex justify-between items-center">
          <span>최근 본 상품</span>
          <Image
            src="/icons/chevron-right.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
        <button className="font-medium cursor-pointer flex justify-between items-center">
          <span>판매 목록</span>
          <Image
            src="/icons/chevron-right.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
        <button className="font-medium cursor-pointer flex justify-between items-center">
          <span>구매 내역</span>
          <Image
            src="/icons/chevron-right.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}
