import CategoryModal from "@/components/community/category-modal";
import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WriteArea({ titleRef, onCategorySelect }) {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState({
    mainCategory: "",
    subCategory: "",
  });

  const isNoticeCategory = selected.mainCategory === "공지사항";

  const { currentUser } = useCurrentUserStore();

  useEffect(() => {
    console.log("✅ selected:", selected);
    console.log("✅ mainCategory:", selected.mainCategory);
    console.log("✅ isNoticeCategory:", isNoticeCategory);
  }, [selected]);

  const handleCategorySelect = (category) => {
    setSelected(category);
    onCategorySelect?.(category);
  };
  console.log("📍선택된 동네:", currentUser?.selectedLocation?.keyword);

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

      {selected.mainCategory.name === "공지사항" && (
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
          {selected.mainCategory && selected.subCategory
            ? `${selected.mainCategory.name} / ${selected.subCategory.label}`
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

      {/* <div className="flex w-full p-4 border-b border-[var(--color-grey-200)]">
        <select>
          <option>카테고리를 선택하세요.</option>
          <option>해외취업</option>
          <option>해외살이</option>
          <option>해외취업</option>
        </select>
        <Image
          src="/icons/chevron-down.svg"
          alt="icon"
          width={18}
          height={18}
          className="cursor-pointer"
        />
      </div> */}
    </div>
  );
}
