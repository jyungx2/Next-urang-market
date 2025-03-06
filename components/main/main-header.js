import Image from "next/image";
import classes from "./main-header.module.css";

export default function MainHeader({ onMenuClick, isOpen }) {
  return (
    <header className={isOpen ? classes.headerOpen : classes.headerClosed}>
      <section className={classes["header-section"]}>
        <div>
          <Image src="/favicon.ico" alt="image" width={48} height={40} />
        </div>
        <div className={classes["header-right"]}>
          <button className={classes.menuBtn} onClick={onMenuClick}>
            <Image
              src={isOpen ? "/icons/xbtn.svg" : "/icons/menu.svg"}
              alt="menu-icon"
              width={28}
              height={28}
            />
          </button>
        </div>
      </section>
    </header>
  );
}
