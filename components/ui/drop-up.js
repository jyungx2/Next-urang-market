import Image from "next/image";

export default function DropUp({ isOpen }) {
  return (
    <div
      className={`absolute right-5 top-214 transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5 pointer-events-none"
      }`}
    >
      <ul className="flex flex-col gap-4 bg-[var(--color-secondary-500)] p-5 rounded-2xl text-[var(--color-com-bg)]">
        <li>
          <button className="flex gap-3 items-center cursor-pointer text-white font-medium">
            <Image
              src="/icons/inbox-stack.svg"
              alt="diverse"
              width={24}
              height={24}
            />
            <span>여러 물건 팔기</span>
          </button>
        </li>
        <li>
          <button className="flex gap-3 items-center cursor-pointer text-white font-medium">
            <Image
              src="/icons/inbox.svg"
              alt="diverse"
              width={24}
              height={24}
            />
            <span>내 물건 팔기</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
