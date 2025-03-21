import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export default function MainCategory() {
  const router = useRouter();
  const query = router.query;
  const pathname = router.pathname;
  console.log(query, pathname);

  return (
    <div id="category-1" className="flex gap-2">
      <button
        className={`rounded-4xl border-none py-4 px-6 font-bold text-[1.4rem] cursor-pointer ${
          pathname === "/community"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        }`}
        onClick={() => router.push("/community")}
      >
        공지사항
      </button>
      <button
        className={`rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer ${
          pathname === "/community/living-abroad"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        }`}
        onClick={() => router.push("/community/living-abroad")}
      >
        해외살이
      </button>
      <button
        className={`rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer ${
          pathname === "/community/working-holiday"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        } `}
        onClick={() => router.push("/community/working-holiday")}
      >
        워킹홀리데이
      </button>
      <button
        className={`rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer  ${
          pathname === "/community/working-abroad"
            ? " bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
            : ""
        }`}
        onClick={() => router.push("/community/working-abroad")}
      >
        해외취업
      </button>
    </div>
  );
}
