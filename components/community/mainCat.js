export default function MainCategory() {
  return (
    <div id="category-1" className="flex gap-2">
      <button className="rounded-4xl border-none bg-[var(--color-primary-50)] text-[var(--color-primary-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer">
        공지사항
      </button>
      <button className="rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer">
        해외살이
      </button>
      <button className="rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer">
        워킹홀리데이
      </button>
      <button className="rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer">
        해외취업
      </button>
    </div>
  );
}
