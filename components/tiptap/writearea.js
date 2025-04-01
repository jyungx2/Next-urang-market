import CategoryModal from "@/components/community/category-modal";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function WriteArea({ onCategorySelect }) {
  const router = useRouter();
  console.log(router.query);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState({
    mainCategory: "",
    subCategory: "",
  });

  const handleCategorySelect = (category) => {
    setSelected(category);
    onCategorySelect?.(category);
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
      <div className="w-full p-4 border-b border-[var(--color-grey-200)]">
        효성동
      </div>

      <div className="flex flex-col p-4 gap-4">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center py-3 text-left"
          type="button"
        >
          {selected.mainCategory && selected.subCategory
            ? `${selected.mainCategory} / ${selected.subCategory}`
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
