import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LocationSearchPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col gap-2 bg-[var(--color-bg)]">
      <div className="grid grid-cols-3 items-center p-4 font-bold border-b border-[var(--color-grey-200)]">
        <button
          className="justify-self-start cursor-pointer"
          onClick={() => router.back()}
        >
          <Image
            src="/icons/chevron-left.svg"
            alt="back-icon"
            width={28}
            height={28}
          />
        </button>
        <h1 className="text-center text-[2rem]">지역 검색</h1>
        <div /> {/* 오른쪽 공간 채우기용 빈 div */}
      </div>
      <div className="flex gap-6 p-4">
        <input
          className="flex-grow bg-[var(--color-grey-100)] rounded-full p-4 text-[1.4rem]"
          placeholder="시/군/구, 읍/면/동 단위로 입력하세요."
        />
        <button className="cursor-pointer">
          <Image
            src="/icons/search.svg"
            alt="search-icon"
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="mx-4">
        <div className="flex flex-col gap-6 text-[1.4rem]">
          <div className="py-4 text-[var(--color-primary-600)] font-medium cursor-pointer">
            <button className="flex gap-1 items-center cursor-pointer">
              <Image
                src="/icons/globe-blue.svg"
                alt="icon"
                width={20}
                height={20}
              />
              <span>내 위치</span>
            </button>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="py-4 text-[var(--color-grey-400)]">
                우리동네
              </span>
              <Image
                src="/icons/check-badge.svg"
                alt="icon"
                width={18}
                height={18}
              />
            </div>

            <ul role="listbox">
              <li role="presentation">
                <Link href="/" className="text-[1.6rem] cursor-pointer">
                  계양구 계산동
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <span className="py-4 text-[var(--color-grey-400)]">
              최근 이용 지역
            </span>
            <ul role="listbox">
              <li role="presentation">
                <Link href="/" className="text-[1.6rem] cursor-pointer">
                  계양구 효성동
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
