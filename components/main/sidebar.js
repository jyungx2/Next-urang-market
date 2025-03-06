import MainHeader from "@/components/main/main-header";
import classes from "./sidebar.module.css";

export default function Sidebar({ isOpen }) {
  return (
    isOpen && (
      <>
        <div className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}>
          <ul>
            <li>중고거래</li>
            <li>부동산</li>
            <li>중고차</li>
            <li>알바</li>
            <li>동네업체</li>
            <li>동네생활</li>
            <li>모임</li>
          </ul>
        </div>
      </>
    )
  );
}
