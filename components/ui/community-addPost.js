import AddPostModal from "@/components/common/addPost-modal";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CommunityAddPost() {
  const router = useRouter();
  const { currentUser } = useCurrentUserStore();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationMatched, setIsLocationMatched] = useState(null); // null, true, false
  const [neighborhood, setNeighborhood] = useState("");

  const handlePostClick = () => {
    console.log("선택된 현재 위치: ", currentUser?.selectedLocation);
    if (!currentUser?.selectedLocation?.isVerified) {
      setShowModal(true);
    } else {
      router.push("/community/post/new");
    }
  };

  return (
    <>
      {/* +POST 버튼의 배경이 되는 역할: 스크롤에도 고정되며, max-w-[640px] 안에서 가운데 정렬(fixed의 경우, 부모가 뷰포트 기준이므로 mx-auto로는 가운데 정렬 불가능..=> block 요소+부모가 너비를 제한할 때만 가능한 속성, mx-auto를 못 쓰는 상황에서 수평 중앙 정렬을 하기 위한 대체 방법을 썼다.) */}
      <div className="fixed bottom-36 left-1/2 translate-x-80 w-full max-w-[640px] z-50">
        <button
          className="bg-[var(--color-secondary-600)] rounded-full py-6 px-8 text-white font-bold cursor-pointer hover:bg-[var(--color-secondary-300)] shadow-lg"
          onClick={handlePostClick}
        >
          + Post
        </button>
      </div>

      {/* 모달: 화면 정가운데 */}
      {showModal && (
        <AddPostModal
          neighborhood={neighborhood}
          setNeighborhood={setNeighborhood}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isLocationMatched={isLocationMatched}
          setIsLocationMatched={setIsLocationMatched}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}
