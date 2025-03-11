import classes from "./sidebar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import UIContext from "@/store/ui-context";

export default function Sidebar() {
  const { isSidebarOpen, isSidebarOverall } = useContext(UIContext);

  return (
    (isSidebarOpen || isSidebarOverall) && (
      <>
        <div className={`${classes.sidebar}`}>
          <div className={classes.menuList}>
            <div className={classes.bundle}>
              <h1>현지거래</h1>
              <ul className={classes.collection}>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">중고거래</Link>
                </li>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">알바</Link>
                </li>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">숙박</Link>
                </li>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">언어</Link>
                </li>
              </ul>
            </div>

            <div className={classes.bundle}>
              <h1>해외살이</h1>
              <ul className={classes.collection}>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">현지생활</Link>
                </li>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">현지맛집</Link>
                </li>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">꿀팁공유</Link>
                </li>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">친구해요</Link>
                </li>
              </ul>
            </div>

            <div className={classes.bundle}>
              <h1>워홀</h1>
              <ul className={classes.collection}>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">필독공지</Link>
                </li>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">비자승인</Link>
                </li>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">경험공유</Link>
                </li>
              </ul>
            </div>

            <div className={classes.bundle}>
              <h1>해외취업</h1>
              <ul className={classes.collection}>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">성공후기</Link>
                </li>
                <li>
                  <Image
                    src="/icons/menuIcon.svg"
                    alt="menu-list-icon"
                    width={20}
                    height={20}
                  />
                  <Link href="/">조언구해요</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  );
}
