import Layout from "@/components/layout/layout";
import RelatedListings from "@/components/market/related-listings";
import WhereToMeet from "@/components/user/where-to-meet";
import { connectDatabase } from "@/helpers/db-util";
import useCurrentUserStore from "@/zustand/currentUserStore";
import useSelectedProductStore from "@/zustand/selectedProduct";
import { ObjectId } from "mongodb";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProductDetailPage({
  selectedProduct,
  relatedListings,
}) {
  const { currentUser } = useCurrentUserStore();
  const router = useRouter();
  const rcode = router.query.rcode;
  console.log(router.pathname); // /market/[productId]
  console.log(router.query); // {productId: '23'}

  const setProduct = useSelectedProductStore((state) => state.setProduct);

  useEffect(() => {
    setProduct(selectedProduct); // 페이지 진입 시 전역 상태로 저장
    console.log("selectedProduct:", selectedProduct);
  }, [setProduct, selectedProduct]);

  const linkBackHandler = () => {
    router.push({ pathname: `/market`, query: { rcode } });
  };

  const linkHomeHandler = () => {
    router.push("/");
  };

  console.log("🎯 product: ", selectedProduct);

  console.log("sellerId 확인:", selectedProduct?.sellerId); // ✅ 문자열이어야 함

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
    <div className="min-h-screen bg-[var(--color-grey-50)]">
      {/* 헤더 (배경 이미지 포함) */}
      <header className="flex-col w-full">
        {/* 상단 네비게이션 버튼들 */}
        <div className="flex justify-between items-center w-full bg-[var(--color-grey-50)] p-4">
          <div className="flex gap-6 items-center">
            <button className="cursor-pointer" onClick={linkBackHandler}>
              <Image
                src="/icons/chevron-left.svg"
                alt="icon"
                width={32}
                height={32}
              />
            </button>
            <button className="cursor-pointer" onClick={linkHomeHandler}>
              <Image
                src="/icons/home-b.svg"
                alt="icon"
                width={30}
                height={30}
              />
            </button>
          </div>
          <div className="flex gap-6 items-center">
            <button className="cursor-pointer">
              <Image
                src="/icons/share-b.svg"
                alt="icon"
                width={26}
                height={26}
              />
            </button>
            <button className="cursor-pointer">
              <Image
                src="/icons/ellipsis-vertical.svg"
                alt="icon"
                width={32}
                height={32}
              />
            </button>
          </div>
        </div>

        {/* 배경 이미지 */}
        <div className="relative w-full h-[40rem] aspect-square">
          <Image
            src={selectedProduct?.productImage}
            alt="image"
            fill
            className="object-cover"
          />
        </div>
      </header>

      {/* 메인 콘텐츠 (배경 이미지 아래) */}
      <main className="relative z-10 p-4">
        {/* 판매자 프로필 */}
        <div className="flex items-center gap-4 pb-4">
          <div className="relative w-[50px] aspect-square rounded-full">
            <Image
              src={selectedProduct?.writerImage}
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
          {/* <div className="ml-auto text-blue-500 font-bold bg-blue-200 p-3 rounded-4xl">
            36.5℃
          </div> */}
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col gap-4 border-t pt-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{selectedProduct?.title}</h1>
            <p className="text-gray-500 text-2xl">
              <span className="underline">[카테고리]</span> ·{" "}
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
                <span>{selectedProduct?.placeName}</span>
                <Image
                  src="/icons/chevron-right.svg"
                  alt="image"
                  width={20}
                  height={20}
                />
              </div>
            </div>

            <WhereToMeet
              lat={selectedProduct?.lat}
              lng={selectedProduct?.lng}
            />
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
          <RelatedListings items={relatedListings} />
        </div>

        {/* <div className="flex flex-col gap-4 mt-10 border-t p-6 px-0 font-bold">
          <header className="flex justify-between items-center">
            <h2 className="font-bold text-[2rem]">
              &apos;{currentUser?.nickname}&apos;님, have you seen these?
            </h2>
          </header>
          <RelatedListings />
        </div> */}
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const productId = context.params.productId;

  try {
    const client = await connectDatabase();
    const db = client.db(process.env.MONGODB_NAME);
    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      return { notFound: true }; // 404 페이지로 이동
    }

    // 관련 상품 조회
    const relatedListings = await db
      .collection("products")
      .find({
        sellerId: product.sellerId,
        _id: { $ne: new ObjectId(productId) },
      })
      .toArray();

    return {
      props: {
        selectedProduct: {
          ...product,
          // 3) 직렬화 (⚠️ ObjectId/Date는 JSON 직렬화 불가 → 문자열 변환 필요)
          _id: product._id.toString(),
          sellerId: product.sellerId?.toString?.() ?? product.sellerId,
          createdAt: product.createdAt
            ? new Date(product.createdAt).toISOString()
            : null,
        },
        relatedListings: relatedListings.map((item) => ({
          ...item,
          _id: item._id.toString(),
          sellerId: item.sellerId?.toString?.() ?? item.sellerId,
          createdAt: item.createdAt
            ? new Date(item.createdAt).toISOString()
            : null,
        })),
      },
      revalidate: 60, // ISR 설정
    };
  } catch (err) {
    console.error("getStaticProps error (product):", err);
    return { notFound: true };
  }

  // const productRes = await fetch(
  //   `http://localhost:3000/api/products/${productId}`
  // );
  // const { product } = await productRes.json();

  // const relatedRes = await fetch(
  //   `http://localhost:3000/api/products/by-seller?sellerId=${product.sellerId}`
  // );

  // const { products } = await relatedRes.json();

  // const relatedListings = products.filter((p) => p._id !== product._id);

  // if (!product) {
  //   return {
  //     notFound: true, // 404 페이지로 이동
  //   };
  // }

  // return {
  //   props: { selectedProduct: product, relatedListings },
  //   // revalidate: 60,
  // };
}

// ✅ 어떤 URL을 빌드할지 결정 -> 모든 post의 productId 명시
export async function getStaticPaths() {
  // const res = await fetch(`http://localhost:3000/api/products`);
  // const data = await res.json();

  const client = await connectDatabase();
  const db = client.db(process.env.MONGODB_NAME);
  const products = await db.collection("products").find().toArray();

  console.log("📦 products:", products);
  const paths = products.map((product) => ({
    params: {
      productId: product._id.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking", // ✅ 나중에 fallback: true로 바꾸고, loading 표시 렌더링 구현하기..
  };
}

// ✅ Layout 적용되도록 getLayout 설정
ProductDetailPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
