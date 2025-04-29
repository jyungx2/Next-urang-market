import useCurrentUserStore from "@/zustand/currentUserStore";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CommunityAddPost() {
  const router = useRouter();
  const { currentUser } = useCurrentUserStore();
  const [showModal, setShowModal] = useState(false);

  const handlePostClick = () => {
    if (currentUser?.selectedLocation?.isVerified === false) {
      setShowModal(true);
    } else {
      router.push("/community/post/new");
    }
  };

  return (
    <>
      {/* Post 버튼: 오른쪽 아래 고정 */}
      <div className="relative max-w-[640px]">
        <button
          className="absolute top-106 right-10 bg-[var(--color-secondary-600)] rounded-full py-4 px-6 text-white font-bold cursor-pointer hover:bg-[var(--color-secondary-300)] shadow-lg"
          onClick={handlePostClick}
        >
          + Post
        </button>
      </div>

      {/* 모달: 화면 정가운데 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md text-center relative">
            {/* 닫기 버튼 */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* 제목 */}
            <h2 className="text-2xl font-bold mb-4">우리동네 추가하기</h2>

            {/* 설명 */}
            <p className="text-gray-600 mb-6 text-[1.4rem]">
              글을 작성하려면 현위치를 확인해서 우리동네로 추가해주세요
            </p>

            {/* 현 위치로 동네 추가 버튼 */}
            <button
              className="bg-green-100 text-green-700 font-semibold py-3 px-5 rounded-lg w-full hover:bg-green-200 transition"
              onClick={() => {
                setShowModal(false);
              }}
            >
              현 위치로 동네 추가 ➕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
