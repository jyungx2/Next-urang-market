import Image from "next/image";

export default function WriteArea() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between p-4 border-b border-[var(--color-grey-200)]">
        <Image
          src="/icons/xbtn.svg"
          alt="icon"
          width={30}
          height={30}
          className="cursor-pointer"
        />
        <button className="text-[var(--color-secondary-800)] font-bold rounded-[6px] px-4 py-2 bg-[var(--color-secondary-50)]">
          등록
        </button>
      </div>
      <div className="w-full p-4 border-b border-[var(--color-grey-200)]">
        효성동
      </div>
      <div className="flex w-full p-4 border-b border-[var(--color-grey-200)]">
        <span>주제를 선택해주세요</span>
        <Image
          src="/icons/chevron-down.svg"
          alt="icon"
          width={18}
          height={18}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
