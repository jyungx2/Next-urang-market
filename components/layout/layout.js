import MainNav from "@/components/layout/main-nav";
import classes from "./layout.module.css";

export default function Layout(props) {
  return (
    <div className={classes["layout-container"]}>
      <main className="h-screen">{props.children}</main>
      <MainNav />
    </div>
  );
}
