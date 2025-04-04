import { motion, AnimatePresence } from "framer-motion";

const carrierList = [
  "SKT",
  "KT",
  "LG U+",
  "SKT 알뜰폰",
  "KT 알뜰폰",
  "LG U+ 알뜰폰",
];

export default function CarrierModal({ isOpen, onClose, onSelect }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 중앙 영역에만 어두운 배경 */}
          <motion.div
            className="fixed inset-0 z-40 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-[2rem] font-bold">통신사를 선택해주세요.</h2>
              <button
                onClick={onClose}
                className="text-[1.6rem] text-grey-500 cursor-pointer"
                type="button"
              >
                닫기
              </button>
            </div>

            {/* 통신사 리스트 */}
            <div className="flex flex-col gap-4 justify-start">
              {carrierList.map((carrier) => (
                <button
                  key={carrier}
                  type="button"
                  onClick={() => {
                    onSelect(carrier); // 선택된 통신사 반환
                    onClose(); // 모달 닫기
                  }}
                  className="px-4 py-2 border text-[1.4rem] bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                >
                  {carrier}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
