import MainNav from "@/components/layout/main-nav";
import classes from "./layout.module.css";
import { useContext, useState } from "react";
import SidebarContext from "@/store/sidebar-context";
import SearchPageContext from "@/store/searchPage-context";

export default function Layout(props) {
  const { isSidebarOpen, isSidebarOverall } = useContext(SidebarContext);
  const { isSearchOpen } = useContext(SearchPageContext);

  return (
    <div className={classes["layout-container"]}>
      <main>{props.children}</main>
      {!(isSidebarOpen || isSearchOpen || isSidebarOverall) && <MainNav />}
    </div>
  );
}
