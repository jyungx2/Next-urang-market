export default function SubCategory() {
  return (
    <div id="category-2" className="flex gap-6 mb-12">
      {/* 상단 버튼에 의해 필터링되는 2차 카테고리
          워홀: 필독공지/비자승인/경험공유
          해외취업: 성공후기/조언구해요 */}

      <button
        role="tab"
        className="font-medium p-2 border-b-2 border-[var(--color-primary-600)] text-[1.4rem] text-[var(--color-primary-600)] cursor-pointer"
      >
        <span>현지생활</span>
      </button>
      <button
        role="tab"
        className="font-medium p-2 text-[1.4rem] cursor-pointer"
      >
        <span>현지맛집</span>
      </button>
      <button
        role="tab"
        className="font-medium p-2 text-[1.4rem] cursor-pointer"
      >
        <span>꿀팁공유</span>
      </button>
      <button
        role="tab"
        className="font-medium p-2 text-[1.4rem] cursor-pointer"
      >
        <span>친구해요</span>
      </button>
    </div>
  );
}
