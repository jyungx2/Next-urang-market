import Image from "next/image";
import classes from "./searchPage.module.css";
import UIContext from "@/store/ui-context";
import { useContext, useEffect, useRef } from "react";

export default function SearchPage() {
  const { toggleSearchPage } = useContext(UIContext);
  const searchBlankRef = useRef(null);

  //  DOM에 직접 접근해야 하는 상황이기 때문에 useRef가 적절.
  // cf) autoFocus속성은 React가 실제 DOM에 붙이기 전에 놓치는 경우가 있어서 브라우저마다 포커스 안 될 수도 있음 → ❌ 불안정
  useEffect(() => {
    searchBlankRef.current.focus();
  }, []);

  return (
    <div className="flex flex-col gap-10 p-6 min-h-screen bg-[var(--color-bg)]">
      <div className="flex items-center gap-4">
        <button className="cursor-pointer" onClick={toggleSearchPage}>
          <Image
            src="/icons/chevron-left.svg"
            alt="icon"
            width={28}
            height={28}
          />
        </button>

        <div className="border rounded grow">
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            className="inputUnset inputCustom"
            ref={searchBlankRef}
          />
        </div>

        <button className="cursor-pointer" onClick={toggleSearchPage}>
          닫기
        </button>
      </div>
      <div className="flex flex-col gap-5">
        <span className="font-medium">추천 검색어</span>
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
        <div className="flex justify-between">
          <span className="font-medium">최근 검색어</span>
          <button className="cursor-pointer font-extralight text-[var(--color-grey-600)]">
            <span>모두삭제</span>
          </button>
        </div>

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
