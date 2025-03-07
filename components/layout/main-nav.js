import Image from "next/image";
import Link from "next/link";
import classes from "./main-nav.module.css";
import { useRouter } from "next/router";
import { useSidebarStore } from "@/zustand/sidebarStore";

export default function MainNav() {
  const router = useRouter();
  const currentPath = router.pathname;

  const isSidebarOpen = useSidebarStore((state) => state.isOpen);
  // const { isOpen : isSidebarOpen } = useSidebarStore(); // 단축코드
  console.log(isSidebarOpen);

  return (
    <nav className={`${classes.navbar} ${isSidebarOpen && "-z-1"}`}>
      <ul className={classes.navList}>
        <li className={classes.navItem}>
          <Link href="/" className={classes.navLink}>
            <Image
              src={
                currentPath === "/"
                  ? "/icons/home.svg"
                  : "/icons/home-active.svg"
              }
              alt="image"
              width={24}
              height={24}
            />
            <span>홈</span>
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link href="/market" className={classes.navLink}>
            <Image src="/icons/market.svg" alt="image" width={28} height={28} />
            <span>사고팔고</span>
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link href="/job" className={classes.navLink}>
            <Image src="/icons/work.svg" alt="image" width={28} height={28} />
            <span>구인구직</span>
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link href="/stay" className={classes.navLink}>
            <Image src="/icons/stay.svg" alt="image" width={28} height={28} />
            <span>숙박</span>
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link href="/profile" className={classes.navLink}>
            <Image
              src="/icons/profile.svg"
              alt="image"
              width={28}
              height={28}
            />
            <span>프로필</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
