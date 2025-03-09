import Image from "next/image";
import classes from "./searchPage.module.css";
import { useSearchStore } from "@/zustand/searchButton";

export default function SearchPage() {
  const { toggleSearch } = useSearchStore();

  return (
    <div className="flex flex-col gap-10 bg-amber-100 p-6 h-screen">
      <div className="flex items-center gap-4">
        <button className="cursor-pointer" onClick={toggleSearch}>
          <Image
            src="/icons/chevron-left.svg"
            alt="icon"
            width={28}
            height={28}
          />
        </button>

        <div className="border rounded grow p-3">
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            className="inputUnset inputCustom"
          />
        </div>

        <button className="cursor-pointer" onClick={toggleSearch}>
          닫기
        </button>
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="font-bold">추천 검색어</h1>
        <ul className="flex gap-4 overflow-x-scroll whitespace-nowrap scrollbar-hide flex-wrap">
          <li className={classes.searchWord}>밥솥</li>
          <li className={classes.searchWord}>노트북</li>
          <li className={classes.searchWord}>책상</li>
          <li className={classes.searchWord}>고양이용품</li>
          <li className={classes.searchWord}>고양이 장난감</li>
          <li className={classes.searchWord}>고양이 사료</li>
        </ul>
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="font-bold">최근 검색어</h1>
        <ul className="flex flex-col gap-6">
          <li className={classes.col}>
            <Image src="/icons/clock.svg" alt="icon" width={20} height={20} />
            <span>밥솥</span>
            <button className="p-2 mx-2">
              <Image src="/icons/xbtn.svg" alt="icon" width={20} height={20} />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
