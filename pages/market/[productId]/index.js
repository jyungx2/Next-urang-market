import Layout from "@/components/layout/layout";
import RelatedListings from "@/components/market/related-listings";
import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { FadeLoader } from "react-spinners";

export default function PostDetailPage({ selectedProduct }) {
  const { currentUser } = useCurrentUserStore();
  const router = useRouter();
  console.log(router.pathname); // /market/[productId]
  console.log(router.query); // {productId: '23'}

  const linkBackHandler = () => {
    router.push("/market");
  };

  const linkHomeHandler = () => {
    router.push("/");
  };

  console.log(selectedProduct);
  // if (router.isFallback)
  //   return (
  //     <div className="min-h-screen flex justify-center items-center bg-[var(--color-bg)]">
  //       <FadeLoader
  //         color={"#2563eb"} // 파란색 (Tailwind 기준 var(--color-primary-500))
  //         size={60}
  //         speedMultiplier={1}
  //       />
  //     </div>
  //   );

  function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date); // createdAt
    const diffInSeconds = Math.floor((now - past) / 1000);

    const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "always" });

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, "second");
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
    }
  }

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
            <p className="text-3xl font-semibold">{selectedProduct?.writer}</p>
            <p className="text-gray-500 text-2xl">
              {selectedProduct?.location}
            </p>
          </div>
          <div className="ml-auto text-blue-500 font-bold bg-blue-200 p-3 rounded-4xl">
            36.5℃
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col gap-4 border-t pt-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{selectedProduct?.title}</h1>
            <p className="text-gray-500 text-2xl">
              <span className="underline">Womens Accessories</span> ·{" "}
              {getTimeAgo(selectedProduct?.createdAt)}
            </p>
            <p className="mt-8 text-3xl font-medium">
              {selectedProduct?.description}
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
              Other listings by &apos;{selectedProduct?.writer}&apos;
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
              &apos;{currentUser?.nickname}&apos;님, have you seen these?
            </h2>
          </header>
          <RelatedListings />
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const productId = context.params.productId;
  console.log("✅ [getStaticProps] productId:", productId); // ← 이거 서버 터미널에 찍혀야 함

  const res = await fetch(`http://localhost:3000/api/products/${productId}`);
  const data = await res.json();
  console.log("prodcutId: ", productId);
  console.log("SSG로 받을 데이터: ", data);

  if (!data.product) {
    return {
      notFound: true, // 404 페이지로 이동
    };
  }

  return {
    props: { selectedProduct: data.product },
    // revalidate: 60,
  };
}

// ✅ 어떤 URL을 빌드할지 결정 -> 모든 post의 productId 명시
export async function getStaticPaths() {
  const res = await fetch("http://localhost:3000/api/products");
  const data = await res.json();

  const paths = data.products.map((product) => ({
    params: {
      productId: product._id.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking", // ✅나중에 fallback: true로 바꾸고, loading 표시 렌더링 구현하기..
  };
}

// ✅ Layout 적용되도록 getLayout 설정
PostDetailPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
