import { Router } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function WriteArea() {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <div className="flex justify-between p-4 border-b border-[var(--color-grey-200)]">
        <button onClick={() => router.push("/community")}>
          <Image
            src="/icons/xbtn.svg"
            alt="icon"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </button>

        <button className="text-[var(--color-secondary-800)] font-bold rounded-[6px] px-4 py-2 bg-[var(--color-secondary-50)] cursor-pointer">
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
