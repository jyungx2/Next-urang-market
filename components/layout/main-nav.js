import Image from "next/image";
import Link from "next/link";
import classes from "./main-nav.module.css";
import { useRouter } from "next/router";

export default function MainNav() {
  const router = useRouter();
  console.log(router.pathname);
  const currentPath = router.pathname;

  return (
    <nav className={classes.navbar}>
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
