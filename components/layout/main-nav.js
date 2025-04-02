import Image from "next/image";
import Link from "next/link";
import classes from "./main-nav.module.css";
import { useRouter } from "next/router";

export default function MainNav() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className={`${classes.navbar}`}>
      <ul className={classes.navList}>
        <li className={classes.navItem}>
          <Link href="/" className={classes.navLink}>
            <Image
              src={
                currentPath === "/"
                  ? "/icons/home.svg"
                  : "/icons/home-inactive.svg"
              }
              alt="image"
              width={26}
              height={26}
            />
            <span>홈</span>
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link href="/market" className={classes.navLink}>
            <Image
              src={
                currentPath === "/market"
                  ? "/icons/dollar.svg"
                  : "/icons/dollar-inactive.svg"
              }
              alt="image"
              width={26}
              height={26}
            />
            <span>사고팔고</span>
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link href="/community/notice" className={classes.navLink}>
            <Image
              src={
                currentPath.includes("/community")
                  ? "/icons/newspaper.svg"
                  : "/icons/newspaper-inactive.svg"
              }
              alt="image"
              width={26}
              height={26}
            />
            <span>커뮤니티</span>
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link href="/chat" className={classes.navLink}>
            <Image
              src={
                currentPath === "/chat"
                  ? "/icons/chat-filled.svg"
                  : "/icons/chat-inactive.svg"
              }
              alt="image"
              width={26}
              height={26}
            />
            <span>채팅</span>
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link href="/profile" className={classes.navLink}>
            <Image
              src={
                currentPath === "/profile"
                  ? "/icons/profile.svg"
                  : "/icons/profile-inactive.svg"
              }
              alt="image"
              width={26}
              height={26}
            />
            <span>프로필</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
