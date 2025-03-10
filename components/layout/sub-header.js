import SearchPageContext from "@/store/searchPage-context";
import SidebarContext from "@/store/sidebar-context";
import Image from "next/image";
import { useContext } from "react";

export default function SubHeader() {
  const { isSidebarOverall, coverAll } = useContext(SidebarContext);
  const { toggleSearchPage } = useContext(SearchPageContext);

  return isSidebarOverall ? (
    <div className="flex font-bold text-4xl top-0 p-8 text-white bg-[var(--color-black)] items-center justify-center relative">
      <button className="absolute left-0 p-4 cursor-pointer" onClick={coverAll}>
        <Image
          src="/icons/chevron-left-w.svg"
          alt="back-icon"
          width={30}
          height={30}
        />
      </button>
      <h1 className="text-3xl">전체 서비스</h1>
    </div>
  ) : (
    <div className="flex font-bold text-4xl sticky top-0 p-6 bg-[var(--color-bg)]">
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
