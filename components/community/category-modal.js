import { motion, AnimatePresence } from "framer-motion";
import categoryData from "@/data/category";

export default function CategoryModal({ isOpen, onClose, onSelect }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이: 중앙 영역에만 까맣게 덮도록 수정 */}
          <motion.div
            className="fixed inset-0 z-40 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 중앙에만 어두운 배경을 깔아줌 */}
            <div
              className="w-full max-w-[640px] bg-black/30 backdrop-blur-sm"
              onClick={onClose}
            />
          </motion.div>

          {/* 아래에서 위로 슬라이드되는 모달 */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-[var(--color-grey-100)] rounded-t-2xl p-6 z-50 max-h-[70vh] max-w-[640px] w-full mx-auto overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-[2rem] font-bold">
                게시글의 주제를 선택해주세요.
              </h2>
              <button
                onClick={onClose}
                className="text-[1.6rem] text-grey-500 cursor-pointer"
                type="button"
              >
                닫기
              </button>
            </div>

            {categoryData.map((cat) => (
              <div key={cat.id} className="mb-8">
                <p className="text-[1.6rem] font-semibold mb-4">{cat.name}</p>
                <div className="flex flex-wrap gap-4">
                  {cat.subCategories.map((sub) => (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => {
                        onSelect({
                          mainCategory: cat.name,
                          subCategory: sub.label,
                        });
                        onClose();
                      }}
                      className="px-4 py-2 rounded-full border text-[1.4rem] bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
