import Image from "next/image";

export default function DropUp({ isOpen }) {
  return (
    <div
      className={`absolute right-5 top-210 transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5 pointer-events-none"
      }`}
    >
      <ul className="flex flex-col gap-4 bg-[var(--color-secondary-400)] p-5 rounded-2xl text-[var(--color-com-bg)]">
        <li className="flex gap-3 items-center cursor-pointer">
          <Image
            src="/icons/inbox-stack.svg"
            alt="diverse"
            width={30}
            height={30}
          />
          여러 물건 팔기
        </li>
        <li className="flex gap-3 items-center cursor-pointer">
          <Image src="/icons/inbox.svg" alt="diverse" width={30} height={30} />
          내 물건 팔기
        </li>
      </ul>
    </div>
  );
}
