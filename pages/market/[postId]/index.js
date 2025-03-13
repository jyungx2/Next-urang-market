import Image from "next/image";
import { useRouter } from "next/router";

export default function PostItemPage() {
  const router = useRouter();
  console.log(router.pathname); // /market/post/[postId]
  console.log(router.query); // {postId: '23'}

  const linkBackhandler = () => {
    router.push("/market");
  };

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
            <button className="cursor-pointer" onClick={linkBackhandler}>
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
        <div className="flex items-center gap-4 border-b p-4">
          <div className="rounded-full">
            <Image
              src="/images/example.jpg"
              alt="image"
              width={36}
              height={36}
              className="rounded-full aspect-square w-full"
            />
          </div>
          <div>
            <p className="text-2xl font-semibold">theye</p>
            <p className="text-gray-500 text-xl">부평구 삼산1동</p>
          </div>
          <div className="ml-auto text-blue-500 font-bold bg-blue-200 p-3 rounded-4xl">
            36.5℃
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col mt-8">
            <h1 className="text-4xl font-bold">루이비통 가방</h1>
            <p className="text-gray-500 text-xl">
              Womens Accessories · 5 hours ago
            </p>
            <p className="mt-4 text-lg">빈티지샵에서 구매했던 제품입니다</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between mt-6 items-center">
              <h2 className="font-bold text-[2rem]">Where to meet</h2>
              <div className="flex items-center">
                <span>올리브영</span>
                <Image
                  src="/icons/chevron-right.svg"
                  alt="image"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <div>GPS</div>
          </div>

          <div className="flex mt-8">
            <p className="mt-2 text-gray-400 text-xl">
              1 chat · 7 favorites · 379 views
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-10 border-t p-6 px-0 font-bold">
          <header className="flex justify-between items-center">
            <h2 className="font-bold text-[2rem]">
              Other listings by '짱가네'
            </h2>
            <Image
              src="/icons/chevron-right.svg"
              alt="image"
              width={28}
              height={28}
            />
          </header>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Image
                src="/images/product-2.jpg"
                alt="product"
                width={280}
                height={200}
                className="aspect-[5/3]"
              />
              <p>거울</p>
              <p>50,000원</p>
            </div>
            <div className="flex flex-col gap-2">
              <Image
                src="/images/product-2.jpg"
                alt="product"
                width={280}
                height={200}
                className="aspect-[5/3]"
              />
              <p>거울</p>
              <p>50,000원</p>
            </div>
            <div className="flex flex-col gap-2">
              <Image
                src="/images/product-2.jpg"
                alt="product"
                width={280}
                height={200}
                className="aspect-[5/3]"
              />
              <p>거울</p>
              <p>50,000원</p>
            </div>
            <div className="flex flex-col gap-2">
              <Image
                src="/images/product-2.jpg"
                alt="product"
                width={280}
                height={200}
                className="aspect-[5/3]"
              />
              <p>거울</p>
              <p>50,000원</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
