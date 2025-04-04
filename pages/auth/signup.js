import CarrierModal from "@/components/user/carrier-modal";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function SignupPage() {
  const [selectedCarrier, setSelectedCarrier] = useState("통신사"); // 선택된 통신사 (기본값: 라벨 '통신사')
  const [modalOpen, setModalOpen] = useState(false); // 모달 열림 여부 상태

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false); // 모달 닫기

  // 모달에서 통신사 선택 시 호출되는 핸들러
  const handleSelectCarrier = (carrier) => {
    setSelectedCarrier(carrier); // 선택한 통신사 상태 업데이트
    closeModal();
  };

  return (
    <div className="max-w-[640px] mx-auto min-h-screen bg-[var(--color-bg)] flex flex-col gap-8 p-4">
      <header className="grid grid-cols-3 items-center justify-center mb-4 border-b border-[var(--color-grey-100)] pb-4">
        <button
          onClick={() => router.back()}
          type="button"
          className="relative w-[30px] aspect-square cursor-pointer"
        >
          <Image
            src="/icons/xbtn.svg"
            alt="icon"
            fill
            className="cursor-pointer"
          />
        </button>
        <h1 className="font-bold text-[2.4rem] col-span-2">
          Identify verification
        </h1>
      </header>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <label className="text-[2rem] font-bold">Enter your full name</label>
          <div
            className={`border-2 border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)] rounded-2xl px-2`}
          >
            <input
              type="text"
              placeholder="Enter name"
              className="inputUnset inputCustom"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <label className="text-[2rem] font-bold">
            Enter your date of birth
          </label>
          <div
            className={`border-2 border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)] rounded-2xl px-2`}
          >
            <input
              type="type"
              placeholder="yy/mm/dd"
              className="inputUnset inputCustom"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* 폼 컨테이너: 통신사 선택 버튼과 전화번호 입력 필드를 한 줄에 배치 */}
          <label className="text-[2rem] font-bold">
            Please enter your phone information
          </label>
          <div className="flex space-x-2">
            {/* 통신사 선택 버튼 (디자인상 select 역할을 하는 버튼) */}
            <button
              type="button"
              onClick={openModal}
              className="px-4 py-2 border-2 border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)] rounded-md bg-white text-gray-500 shadow-sm"
            >
              {selectedCarrier}
              {/* ▲ 버튼 라벨: 현재 선택된 통신사 표시 (기본값은 '통신사') */}
            </button>

            {/* 전화번호 입력 필드 */}
            <input
              type="tel"
              placeholder="전화번호 입력"
              className="px-4 py-4 border-2 border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)] rounded-md flex-1 focus:outline-none"
            />

            <button className="bg-[var(--color-grey-500)] hover:bg-[var(--color-grey-700)] rounded-xl text-white py-2 px-4 cursor-pointer">
              인증번호 요청
            </button>
          </div>

          {/* 모달 컴포넌트 (CarrierModal) - AnimatePresence로 감싸서 진입/퇴장 애니메이션 적용 */}
          <AnimatePresence>
            {modalOpen && (
              <CarrierModal
                isOpen={modalOpen} // 모달 닫기 함수 전달
                onClose={closeModal}
                onSelect={handleSelectCarrier} // 통신사 선택 함수 전달
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-[2rem] font-bold">
            Please enter your verification code
          </label>
          <div className="flex space-x-2 items-center border-2 rounded-md border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)]">
            <input
              placeholder="인증번호 입력"
              className="px-3 py-4 flex-1 focus:outline-none"
            />
            <span className="p-4">4:58</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <button className="font-bold h-[4rem] bg-[var(--color-primary-500)] p-4 w-full rounded-lg text-white cursor-pointer hover:bg-[var(--color-primary-700)]">
          Confirm
        </button>
      </div>
    </div>
  );
}

// ✅ Layout 적용 안 하도록 getLayout 설정
SignupPage.getLayout = function noLayout(page) {
  return page; // Layout 안 씌움
};
