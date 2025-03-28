import Link from "next/link";
import classes from "./posts-section.module.css";
import Image from "next/image";

export default function PostsSection({ title, category }) {
  return (
    <section className="mb-10">
      <header className={classes.header}>
        <h1 className={classes.title}>{title}</h1>

        <Link href={`/community/${category}`} className={classes.Link}>
          <span>더보기</span>
          <Image
            src="/icons/arrow-up-right.svg"
            alt="go-to-see-more"
            width={18}
            height={18}
          />
        </Link>
      </header>

      <div className={classes.grid}>
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[5/3] flex-shrink-0">
            <Image
              src="/images/example.jpg"
              alt="image"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-2">
            <p>제목</p>
            <p>작성자</p>
            <div className="flex gap-2">
              <p>작성시간</p>
              <p>조회수</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[5/3] flex-shrink-0">
            <Image
              src="/images/example.jpg"
              alt="image"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-2">
            <p>제목</p>
            <p>작성자</p>
            <div className="flex gap-2">
              <p>작성시간</p>
              <p>조회수</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[5/3] flex-shrink-0">
            <Image
              src="/images/example.jpg"
              alt="image"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-2">
            <p>제목</p>
            <p>작성자</p>
            <div className="flex gap-2">
              <p>작성시간</p>
              <p>조회수</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[5/3] flex-shrink-0">
            <Image
              src="/images/example.jpg"
              alt="image"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-2">
            <p>제목</p>
            <p>작성자</p>
            <div className="flex gap-2">
              <p>작성시간</p>
              <p>조회수</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[5/3] flex-shrink-0">
            <Image
              src="/images/example.jpg"
              alt="image"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-2">
            <p>제목</p>
            <p>작성자</p>
            <div className="flex gap-2">
              <p>작성시간</p>
              <p>조회수</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[5/3] flex-shrink-0">
            <Image
              src="/images/example.jpg"
              alt="image"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-2">
            <p>제목</p>
            <p>작성자</p>
            <div className="flex gap-2">
              <p>작성시간</p>
              <p>조회수</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
