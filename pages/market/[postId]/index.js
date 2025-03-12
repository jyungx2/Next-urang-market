import UIContext from "@/store/ui-context";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export default function PostItemPage() {
  const router = useRouter();
  console.log(router.pathname); // /market/post/[postId]
  console.log(router.query); // {postId: '23'}

  const { isProductOpen, toggleProductPage } = useContext(UIContext);
  // ✅ 상품 상세 페이지에 도착하면 isProductOpen을 true로 유지
  useEffect(() => {
    if (!isProductOpen) {
      toggleProductPage();
    }
  }, [isProductOpen]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 (배경 이미지 포함) */}
      <header className="relative flex justify-between top-0 w-full h-[40rem] z-50 p-4">
        {/* 배경 이미지 */}
        <Image
          src="/images/product.jpg"
          alt="image"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />

        {/* 상단 네비게이션 버튼들 */}
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-6">
            <button className="cursor-pointer">
              <Image
                src="/icons/chevron-left-w.svg"
                alt="icon"
                width={28}
                height={28}
              />
            </button>
            <button className="cursor-pointer">
              <Image
                src="/icons/home-w.svg"
                alt="icon"
                width={28}
                height={28}
              />
            </button>
          </div>
          <div className="flex gap-6">
            <button className="cursor-pointer">
              <Image
                src="/icons/share-w.svg"
                alt="icon"
                width={28}
                height={28}
              />
            </button>
            <button className="cursor-pointer">
              <Image
                src="/icons/ellipsis-vertical-w.svg"
                alt="icon"
                width={28}
                height={28}
              />
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 (배경 이미지 아래) */}
      <main className="relative z-10 bg-white rounded-t-3xl p-6">
        {/* 판매자 프로필 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div>
            <p className="text-xl font-semibold">theye</p>
            <p className="text-gray-500 text-xl">부평구 삼산1동</p>
          </div>
          <div className="ml-auto text-blue-500 font-bold">36.5℃</div>
        </div>
        {/* 상품 정보 */}
        <div className="flex flex-col mt-6">
          <h1 className="text-4xl font-bold">루이비통 가방</h1>
          <p className="text-gray-500 text-xl">
            Womens Accessories · 5 hours ago
          </p>
          <p className="mt-4 text-lg">빈티지샵에서 구매했던 제품입니다</p>
          <p className="mt-2 text-gray-400 text-xl">
            1 chat · 7 favorites · 379 views
          </p>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="text-4xl font-bold">루이비통 가방</h1>
          <p className="text-gray-500 text-xl">
            Womens Accessories · 5 hours ago
          </p>
          <p className="mt-4 text-lg">빈티지샵에서 구매했던 제품입니다</p>
          <p className="mt-2 text-gray-400 text-xl">
            1 chat · 7 favorites · 379 views
          </p>
        </div>{" "}
        <div className="flex flex-col mt-6">
          <h1 className="text-4xl font-bold">루이비통 가방</h1>
          <p className="text-gray-500 text-xl">
            Womens Accessories · 5 hours ago
          </p>
          <p className="mt-4 text-lg">빈티지샵에서 구매했던 제품입니다</p>
          <p className="mt-2 text-gray-400 text-xl">
            1 chat · 7 favorites · 379 views
          </p>
        </div>
      </main>

      {/* 가격 및 채팅 버튼 */}
      <div className="flex items-center justify-between sticky bottom-0 z-200 bg-amber-200">
        <div className="flex justify-center items-center border-r p-6">
          <Image src="/icons/heart.svg" alt="icon" width={28} height={28} />
        </div>
        <div className="flex justify-between items-center w-full p-6">
          <p className="text-3xl font-bold">60,000원</p>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold">
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}
