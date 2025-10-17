import classes from "./sidebar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/store/sidebar-context";

export default function Sidebar() {
  // const { toggleSidebar } = useContext(UIContext);
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex flex-col gap-10 p-6 min-h-screen bg-[var(--color-com-bg)]">
      <div className="flex font-bold text-4xl top-0 text-white items-center justify-center relative">
        <button
          className="absolute left-0 cursor-pointer"
          onClick={toggleSidebar}
        >
          <Image
            src="/icons/chevron-left-w.svg"
            alt="back-icon"
            width={30}
            height={30}
          />
        </button>
        <h1 className="text-[2.4rem]">전체 서비스</h1>
      </div>

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
    </div>
  );
}
