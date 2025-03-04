import Image from "next/image";
import classes from "./search-form.module.css";

export default function SearchForm() {
  return (
    <form className={classes.searchForm}>
      <button>
        <div className={classes.searchButton}>
          <span>중고거래</span>
          <Image src="/icons/triangle.svg" alt="image" width={18} height={18} />
        </div>
      </button>
      <div className={classes["search-input-wrapper"]}>
        <input
          type="text"
          className={classes.searchInput}
          placeholder="Search"
        />
        <button>
          <Image src="/icons/search.svg" alt="image" width={24} height={24} />
        </button>
      </div>
    </form>
  );
}
