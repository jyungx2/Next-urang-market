import RelatedListings from "@/components/market/related-listings";
import Image from "next/image";
import { useRouter } from "next/router";

export default function PostDetailPage() {
  const router = useRouter();
  console.log(router.pathname); // /market/post/[postId]
  console.log(router.query); // {postId: '23'}

  const linkBackHandler = () => {
    router.push("/market");
  };

  const linkHomeHandler = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* 헤더 (배경 이미지 포함) */}
      <header className="relative flex justify-between top-0 w-full z-50 p-4 aspect-[5/4]">
        {/* 배경 이미지 */}
        <Image
          src="/images/product.jpg"
          alt="image"
          fill
          className="absolute top-0 left-0 object-cover -z-10"
        />

        {/* 상단 네비게이션 버튼들 */}
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-6">
            <button className="cursor-pointer" onClick={linkBackHandler}>
              <Image
                src="/icons/chevron-left-w.svg"
                alt="icon"
                width={28}
                height={28}
              />
            </button>
            <button className="cursor-pointer" onClick={linkHomeHandler}>
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
      <main className="relative z-10 p-4">
        {/* 판매자 프로필 */}
        <div className="flex items-center gap-4 pb-4">
          <div className="relative w-[50px] aspect-square rounded-full">
            <Image
              src="/images/example.jpg"
              alt="image"
              fill
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-semibold">김테이</p>
            <p className="text-gray-500 text-2xl">부평구 삼산1동</p>
          </div>
          <div className="ml-auto text-blue-500 font-bold bg-blue-200 p-3 rounded-4xl">
            36.5℃
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col gap-4 border-t pt-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">루이비통 가방</h1>
            <p className="text-gray-500 text-2xl">
              <span className="underline">Womens Accessories</span> · 5 hours
              ago
            </p>
            <p className="mt-8 text-3xl font-medium">
              빈티지샵에서 구매했던 제품입니다. 뱀부그린컬러로 포인트로 너무예쁜
              가방이에요 가방끈 갈라짐 있으나 사용하는데 전혀지장없구요 사제로
              크로스끈이나 체인 구매해서 달면 될듯해요 두번째 사진이
              원컬러입니다
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[2rem]">Where to meet</h2>
              <div className="flex items-center cursor-pointer">
                <span>올리브영</span>
                <Image
                  src="/icons/chevron-right.svg"
                  alt="image"
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div className="p-10 border text-center">GPS</div>
          </div>

          <div className="flex mt-8">
            <p className=" text-gray-400 text-xl">
              1 chat · 7 favorites · 379 views
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-10 border-t p-6 px-0 font-bold">
          <header className="flex justify-between items-center">
            <h2 className="font-bold text-[2rem]">
              Other listings by &apos;김테이&apos;
            </h2>
            <button className="cursor-pointer">
              <Image
                src="/icons/chevron-right.svg"
                alt="image"
                width={28}
                height={28}
              />
            </button>
          </header>
          <RelatedListings />
        </div>

        <div className="flex flex-col gap-4 mt-10 border-t p-6 px-0 font-bold">
          <header className="flex justify-between items-center">
            <h2 className="font-bold text-[2rem]">
              &apos;username&apos;님, have you seen these?
            </h2>
          </header>
          <RelatedListings />
        </div>
      </main>
    </div>
  );
}
