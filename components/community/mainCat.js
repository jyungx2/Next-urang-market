import useCurrentUserStore from "@/zustand/currentUserStore";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MainCategory() {
  const router = useRouter();
  const { mainCategory } = router.query;
  const { currentUser } = useCurrentUserStore();
  const rcode =
    currentUser?.selectedLocation?.rcode || currentUser?.location?.rcode;

  return (
    <div id="category-1" className="flex gap-2">
      <Link
        href={{
          pathname: `/community/notice`,
          query: { rcode }, // 쿼리 유지
        }}
        className={`rounded-4xl border-none py-4 px-6 font-bold text-[1.4rem] cursor-pointer ${
          mainCategory === "notice"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        }`}
      >
        공지사항
      </Link>
      <Link
        href={{
          pathname: `/community/living-abroad`,
          query: { rcode },
        }}
        className={`rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer ${
          mainCategory === "living-abroad"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        }`}
      >
        해외살이
      </Link>
      <Link
        href={{
          pathname: `/community/working-holiday`,
          query: { rcode },
        }}
        className={`rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer ${
          mainCategory === "working-holiday"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        } `}
      >
        워킹홀리데이
      </Link>
      <Link
        href={{
          pathname: `/community/working-abroad`,
          query: { rcode },
        }}
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
