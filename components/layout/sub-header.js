import Image from "next/image";

export default function SubHeader() {
  return (
    <div className="flex font-bold text-4xl sticky top-0 p-6 bg-[var(--color-secondary-50)]">
      <div className="flex items-center gap-1 cursor-pointer">
        <span>계산 2동</span>
        <Image
          src="/icons/chevron-down.svg"
          alt="image"
          width={24}
          height={24}
        />
      </div>

      <div className="flex ml-auto gap-8">
        <button className="cursor-pointer">
          <Image src="/icons/menu.svg" alt="menu-icon" width={28} height={28} />
        </button>
        <button className="cursor-pointer">
          <Image
            src="/icons/search.svg"
            alt="menu-icon"
            width={28}
            height={28}
          />
        </button>
        <button className="cursor-pointer">
          <Image
            src="/icons/alarm.svg"
            alt="menu-icon"
            width={28}
            height={28}
          />
        </button>
      </div>
    </div>
  );
}
