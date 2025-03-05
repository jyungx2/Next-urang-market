import Image from "next/image";
import classes from "../main/search-form.module.css";

export default function Location() {
  return (
    <button className={`${classes.buttonUnset} ${classes.locationBtn}`}>
      <span>위치</span>
      <Image src="/icons/location.svg" alt="image" width={18} height={18} />
    </button>
  );
}
