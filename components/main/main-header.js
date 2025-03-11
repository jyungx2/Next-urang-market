import Image from "next/image";
import classes from "./main-header.module.css";
import { useContext } from "react";
import UIContext from "@/store/ui-context";

export default function MainHeader() {
  const { toggleSidebar } = useContext(UIContext);

  return (
    <header className={`${classes.header}`}>
      <section className={classes["header-section"]}>
        <div>
          <Image src="/favicon.ico" alt="image" width={48} height={40} />
        </div>
        <div className={classes["header-right"]}>
          <button className={classes.menuBtn} onClick={toggleSidebar}>
            <Image
              src="/icons/menu.svg"
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
