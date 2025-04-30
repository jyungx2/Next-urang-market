import CategoryModal from "@/components/community/category-modal";
import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WriteArea({ titleRef, category, onCategorySelect }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const isNoticeCategory = category.mainCategory.name === "공지사항";
  const { currentUser } = useCurrentUserStore();

  // useEffect(() => {
  //   console.log("✅ category:", category);
  //   console.log("✅ mainCategory:", category.mainCategory);
  //   console.log("✅ isNoticeCategory:", isNoticeCategory);
  // }, [category]);

  const handleCategorySelect = (category) => {
    onCategorySelect(category);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between p-4 border-b border-[var(--color-grey-200)]">
        <button onClick={() => router.back()} type="button">
          <Image
            src="/icons/xbtn.svg"
            alt="icon"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </button>

        <button className="text-[var(--color-secondary-800)] font-bold rounded-[6px] px-4 py-2 bg-[var(--color-secondary-50)] cursor-pointer">
          등록
        </button>
      </div>

      {category.mainCategory.name === "공지사항" && (
        <div className="w-full p-4 border-b border-[var(--color-grey-200)]">
          <input
            ref={titleRef}
            type="text"
            placeholder="제목을 입력하세요"
            required
            className="focus:outline-none focus:ring-0"
          />
        </div>
      )}

      <div className="w-full p-4 border-b border-[var(--color-grey-200)]">
        {currentUser?.selectedLocation?.keyword.slice(-1)[0]}
      </div>

      <div className="flex flex-col p-4 gap-4">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center py-3 text-left"
          type="button"
        >
          {category.mainCategory.name && category.subCategory.label
            ? `${category.mainCategory.name} / ${category.subCategory.label}`
            : "게시글의 주제를 선택해주세요."}
          <Image
            src="/icons/chevron-down.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>

        <CategoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={handleCategorySelect}
        />
      </div>
    </div>
  );
}
