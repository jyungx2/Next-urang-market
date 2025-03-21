import { useRouter } from "next/router";

export default function SubCategory() {
  const router = useRouter();
  const pathname = router.pathname;
  console.log(pathname);

  const categories = {
    "/community": [
      { id: 1, label: "필독공지" },
      { id: 2, label: "업데이트" },
      { id: 3, label: "이벤트" },
    ],
    "/community/living-abroad": [
      { id: 4, label: "현지생활" },
      { id: 5, label: "현지맛집" },
      { id: 6, label: "친구해요" },
    ],
    "/community/working-holiday": [
      { id: 7, label: "비자승인" },
      { id: 8, label: "경험공유" },
    ],
    "/community/working-abroad": [
      { id: 9, label: "성공후기" },
      { id: 10, label: "조언구해요" },
    ],
  };

  const subCategories = categories[pathname];

  return (
    <div id="category-2" className="flex gap-6 mb-12">
      {/* 상단 버튼에 의해 필터링되는 2차 카테고리
          워홀: 필독공지/비자승인/경험공유
          해외취업: 성공후기/조언구해요 */}

      {subCategories.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          className="font-medium p-2 border-b-2 border-[var(--color-primary-600)] text-[1.4rem] text-[var(--color-primary-600)] cursor-pointer"
        >
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
