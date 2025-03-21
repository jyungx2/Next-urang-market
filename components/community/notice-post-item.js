import Image from "next/image";
import Link from "next/link";

export default function NoticePostItem({ writer, createdAt, views, title }) {
  return (
    <li className="border-b border-[var(--color-grey-300)] pb-4">
      <div className="flex gap-2 justify-between">
        <div className="flex flex-col gap-4">
          <span>{title}</span>
          <div className="flex gap-3 text-[1.4rem]">
            <span>{writer}</span>
            <span>{createdAt}</span>
            <span>조회 {views}</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative w-[70px] h-[70px]">
            <Image
              src="/images/example.jpg"
              alt="icon"
              fill
              className="rounded-3xl object-cover aspect-square"
            />
          </div>
          <div>
            <Link
              href="/"
              className="bg-[var(--color-secondary-800)] rounded-4xl flex flex-col gap-2 p-6 justify-center items-center"
            >
              <span className="font-bold text-[var(--color-grey-bg)]">362</span>
              <span className="text-[1.4rem] text-white">댓글</span>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
