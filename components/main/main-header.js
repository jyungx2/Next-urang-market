import Image from "next/image";
import classes from "./main-header.module.css";
import { useContext } from "react";
import SidebarContext from "@/store/sidebar-context";

export default function MainHeader({ onMenuClick, isOpen }) {
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  return (
    <header
      className={`${classes.header} ${
        isOpen ? classes.headerOpen : classes.headerClosed
      }`}
    >
      <section className={classes["header-section"]}>
        <div>
          <Image src="/favicon.ico" alt="image" width={48} height={40} />
        </div>
        <div className={classes["header-right"]}>
          <button className={classes.menuBtn} onClick={toggleSidebar}>
            <Image
              src={isSidebarOpen ? "/icons/xbtn.svg" : "/icons/menu.svg"}
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
