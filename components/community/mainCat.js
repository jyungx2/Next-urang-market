import Link from "next/link";
import { useRouter } from "next/router";

export default function MainCategory() {
  const router = useRouter();
  const { mainCategory } = router.query;

  return (
    <div id="category-1" className="flex gap-2">
      <Link
        href="/community/notice"
        className={`rounded-4xl border-none py-4 px-6 font-bold text-[1.4rem] cursor-pointer ${
          mainCategory === "notice"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        }`}
      >
        공지사항
      </Link>
      <Link
        href="/community/living-abroad"
        className={`rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer ${
          mainCategory === "living-abroad"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        }`}
      >
        해외살이
      </Link>
      <Link
        href="/community/working-holiday"
        className={`rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer ${
          mainCategory === "working-holiday"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        } `}
      >
        워킹홀리데이
      </Link>
      <Link
        href="/community/working-abroad"
        className={`rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer  ${
          mainCategory === "working-abroad"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        }`}
      >
        해외취업
      </Link>
    </div>
  );
}
