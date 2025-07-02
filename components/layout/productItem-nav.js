import useSelectedProductStore from "@/zustand/selectedProduct";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ProductItemNav() {
  const router = useRouter();
  const productId = router.query.productId;
  const { selectedProduct } = useSelectedProductStore();

  const linkToChatPageHandler = (productId) => {
    console.log(productId);
    router.push(`/market/${productId}/chat`);
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
          {selectedProduct?.price
            ? `${selectedProduct?.price?.toLocaleString()}원`
            : "Free"}
        </p>

        <div className="flex gap-4">
          {/* <button
            className="px-6 py-3 bg-[var(--color-secondary-600)] text-white rounded-full font-semibold cursor-pointer hover:bg-[var(--color-secondary-500)] focus:bg-[var(--color-secondary-500)]"
            onClick={() => linkToChatPageHandler(productId)}
          >
            장바구니
          </button> */}
          <button
            className="px-6 py-3 bg-[var(--color-primary-400)] text-white rounded-full font-semibold cursor-pointer hover:bg-[var(--color-primary-300)] focus:bg-[var(--color-primary-300)]"
            onClick={() => linkToChatPageHandler(productId)}
          >
            채팅
          </button>
        </div>
      </div>
    </div>
  );
}
