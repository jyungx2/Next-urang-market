import useSelectedProductStore from "@/zustand/selectedProduct";
import Image from "next/image";
import { useRouter } from "next/router";

export default function PostItemNav() {
  const router = useRouter();
  const postId = router.query.postId;
  const { selectedProduct } = useSelectedProductStore();

  const linkToChatPageHandler = (postId) => {
    console.log(postId);
    router.push(`/market/${postId}/chat`);
  };

  return (
    <div className="flex items-center justify-between sticky bottom-0 z-200 bg-[var(--color-com-bg)] p-2">
      <div className="flex justify-center items-center border-r border-[var(--color-bg)] p-4">
        <button className="cursor-pointer">
          <Image src="/icons/heart-w.svg" alt="icon" width={36} height={36} />
        </button>
      </div>
      <div className="flex justify-between items-center w-full p-4">
        <p className="text-[1.8rem] font-bold text-[var(--color-bg)]">
          {selectedProduct.price
            ? `${selectedProduct?.price?.toLocaleString()}원`
            : "Free"}
        </p>
        <button
          className="px-6 py-3 bg-[var(--color-primary-400)] text-white rounded-full font-semibold cursor-pointer hover:bg-[var(--color-primary-300)] focus:bg-[var(--color-primary-300)]"
          onClick={() => linkToChatPageHandler(postId)}
        >
          Chat
        </button>
      </div>
    </div>
  );
}
