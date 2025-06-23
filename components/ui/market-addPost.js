import AddPostModal from "@/components/common/addPost-modal";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useRouter } from "next/router";
import { useState } from "react";

export default function MarketAddPost({ isOpen }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationMatched, setIsLocationMatched] = useState(null); // null, true, false
  const [neighborhood, setNeighborhood] = useState("");

  const router = useRouter();
  const rcode = router.query.rcode;
  const { currentUser } = useCurrentUserStore();

  const handlePostClick = () => {
    console.log("선택된 현재 위치: ", currentUser?.selectedLocation);
    if (!currentUser?.selectedLocation?.isVerified) {
      setShowModal(true);
    } else {
      router.push({ pathname: "/market/product/new", query: { rcode } });
    }
  };

  return (
    <>
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

      {/* <div
          className={`w-fit mb-2 -translate-x-20 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5 pointer-events-none"
          }`}
        >
          <ul className="flex flex-col gap-4 bg-[var(--color-secondary-500)] p-5 rounded-2xl text-[var(--color-com-bg)]">
            <li>
              <button className="flex gap-3 items-center cursor-pointer text-white font-medium">
                <Image
                  src="/icons/inbox-stack.svg"
                  alt="diverse"
                  width={24}
                  height={24}
                />
                <span>여러 물건 팔기</span>
              </button>
            </li>
            <li>
              <button
                onClick={handlePostClick}
                className="flex gap-3 items-center cursor-pointer text-white font-medium"
              >
                <Image
                  src="/icons/inbox.svg"
                  alt="diverse"
                  width={24}
                  height={24}
                />
                <span>내 물건 팔기</span>
              </button>
            </li>
          </ul>
        </div> */}

      <div className="fixed bottom-36 left-1/2 translate-x-80 w-full max-w-[640px] z-50">
        <button
          onClick={handlePostClick}
          className="bg-[var(--color-secondary-600)] rounded-full py-6 px-8 text-white font-bold shadow-lg hover:bg-[var(--color-secondary-300)]"
        >
          + Post
        </button>
      </div>
    </>
  );
}
