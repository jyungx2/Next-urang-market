import Image from "next/image";
import Link from "next/link";
import classes from "./main-header.module.css";

export default function MainHeader() {
  return (
    <header className={classes.header}>
      <section className={classes["header-section"]}>
        <div>
          <Image src="/favicon.ico" alt="image" width={48} height={40} />
        </div>
        <div className={classes["header-right"]}>
          <Link href="/">
            <Image src="/icons/menu.svg" alt="image" width={28} height={28} />
          </Link>
        </div>
      </section>
    </header>
  );
}
