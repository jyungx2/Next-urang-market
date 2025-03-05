import Link from "next/link";
import classes from "./posts-section.module.css";

export default function PostsSection() {
  return (
    <section>
      <header className={classes.header}>
        <div>워홀준비공지</div>

        <Link href="/" className={classes.Link}>
          <span>더보기</span>
        </Link>
      </header>

      <div className={classes.div}></div>
    </section>
  );
}
