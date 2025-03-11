import UIContext from "@/store/ui-context";
import Image from "next/image";
import { useContext } from "react";

export default function SubHeader() {
  const {
    isSidebarOverall,
    coverAll,
    toggleSearchPage,
    toggleNotificationPage,
  } = useContext(UIContext);

  return (
    <div className="flex font-bold text-4xl sticky top-0 py-6 bg-[var(--color-bg)]">
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
        <button className="cursor-pointer" onClick={coverAll}>
          <Image src="/icons/menu.svg" alt="menu-icon" width={28} height={28} />
        </button>
        <button className="cursor-pointer" onClick={toggleSearchPage}>
          <Image
            src="/icons/search.svg"
            alt="menu-icon"
            width={28}
            height={28}
          />
        </button>
        <button className="cursor-pointer" onClick={toggleNotificationPage}>
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
