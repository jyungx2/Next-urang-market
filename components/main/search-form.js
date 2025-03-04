import Image from "next/image";
import classes from "./search-form.module.css";

export default function SearchForm() {
  return (
    <form className={classes.searchForm}>
      <button className={`${classes.buttonUnset} ${classes.locationBtn}`}>
        <span>위치</span>
        <Image src="/icons/location.svg" alt="image" width={18} height={18} />
      </button>

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
            placeholder="Search"
          />
        </div>

        <button className={`${classes.buttonUnset} ${classes.searchBtn}`}>
          <Image src="/icons/search.svg" alt="image" width={24} height={24} />
        </button>
      </div>
    </form>
  );
}
