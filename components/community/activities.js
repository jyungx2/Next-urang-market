import Image from "next/image";

export default function Activities() {
  return (
    <div className="gap-6 items-center p-6 rounded-2xl bg-[var(--color-primary-50)]">
      <h2 className="mb-6 font-bold text-[2rem]">나의 활동</h2>
      <div className="flex flex-col gap-6">
        <button
          className="font-medium cursor-pointer flex justify-between items-center"
          onClick={() => alert("현재 준비중인 기능입니다!")}
        >
          <span>위시리스트</span>
          <Image
            src="/icons/chevron-right.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
        <button
          className="font-medium cursor-pointer flex justify-between items-center"
          onClick={() => alert("현재 준비중인 기능입니다!")}
        >
          <span>구매 내역</span>
          <Image
            src="/icons/chevron-right.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
        <button
          className="font-medium cursor-pointer flex justify-between items-center"
          onClick={() => alert("현재 준비중인 기능입니다!")}
        >
          <span>판매 목록</span>
          <Image
            src="/icons/chevron-right.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
        <button
          className="font-medium cursor-pointer flex justify-between items-center"
          onClick={() => alert("현재 준비중인 기능입니다!")}
        >
          <span>최근 본 물품</span>
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
