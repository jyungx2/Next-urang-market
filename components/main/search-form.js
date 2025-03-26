import Image from "next/image";
import classes from "./search-form.module.css";
import Location from "@/components/layout/location";
import { useContext } from "react";
import UIContext from "@/store/ui-context";
import SearchPage from "@/components/common/searchPage";

export default function SearchForm() {
  const { toggleSearchPage } = useContext(UIContext);

  return (
    <div className={classes.container}>
      <Location />

      <form className={classes.searchForm}>
        <div className={classes.wrapper}>
          <div className={classes.categoryButton}>
            <span>중고거래</span>
            <Image
              src="/icons/chevron-down.svg"
              alt="image"
              width={18}
              height={18}
            />
          </div>

          <div className={classes.searchFlexGrow}>
            <input
              type="text"
              className={`${classes.inputUnset} ${classes.searchInput}`}
              placeholder="검색어를 입력하세요."
              onFocus={toggleSearchPage}
            />
          </div>

          <button className={`${classes.buttonUnset} ${classes.searchBtn}`}>
            <Image src="/icons/search.svg" alt="image" width={24} height={24} />
          </button>
        </div>
      </form>
    </div>
  );
}
