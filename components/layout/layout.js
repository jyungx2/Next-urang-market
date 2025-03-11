import MainNav from "@/components/layout/main-nav";
import classes from "./layout.module.css";
import { useContext } from "react";
import UIContext from "@/store/ui-context";

export default function Layout(props) {
  const { isSidebarOpen, isSidebarOverall, isSearchOpen } =
    useContext(UIContext);

  return (
    <div className={classes["layout-container"]}>
      <main>{props.children}</main>
      {!(isSidebarOpen || isSearchOpen || isSidebarOverall) && <MainNav />}
    </div>
  );
}
