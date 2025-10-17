import SubHeader from "@/components/market/sub-header";
import ProductsList from "@/components/market/product-list";
import UIContext from "@/store/ui-context";
import { useContext, useState } from "react";
import MarketAddPost from "@/components/ui/market-addPost";
import Layout from "@/components/layout/layout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { PropagateLoader } from "react-spinners";
import useCurrentUserStore from "@/zustand/currentUserStore";

export default function MarketPage() {
  const { isSidebarOpen, isSearchOpen, isNotificationOpen } =
    useContext(UIContext);
  const { currentUser } = useCurrentUserStore();
  const [isDropUpOpen] = useState(false);
  const router = useRouter();
  const rcode = router.query.rcode;
  const keyword = router.query.keyword;

  // 🖍️특정 컴포넌트에서 렌더링할 데이터는 페이지 단위에서 가져오는 게 SEO측면에서 좋음!
  // 컴포넌트 내부에서 useEffect로 데이터 가져오는 방식(CSR)보단(검색 엔진이 데이터를 가져오기 전에 빈 페이지를 먼저 크롤링할 가능성이 높음. & 구글 검색에 노출되지 않을 가능성이 높아짐.), 페이지 단위에서 데이터를 가져오는 방식(SSR, SSG)이 서버에서 데이터를 가져온 후, 정적 HTML을 생성하기 때문에 검색엔진이 완전한 페이지를 크롤링 가능하게 하여 SEO최적화가 잘 되어 검색노출이 쉬워진다!
  // const toggleDropUp = () => {
  //   setIsDropUpOpen(!isDropUpOpen);
  // };

  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", rcode, keyword], // keyword를 key에 넣어서 리렌더링 트리거
    queryFn: async () => {
      const res = await fetch(
        `/api/products?rcode=${rcode}${
          keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""
        }`
      );

      if (!res.ok) {
        throw new Error("데이터 요청 실패");
      }
      const data = await res.json();
      console.log(data.products);
      return data;
    },
    select: (data) => data.products,
    // enabled: rcode, // 지역코드 정보가 없으면 fetch 막기
  });
  console.log(productData, "상품 데이터");

  // if (isLoading) {
  //   return <p>⏳ 데이터를 불러오는 중입니다...</p>;
  // }

  if (isError) {
    console.error(error.message);
    return <p>💥 데이터를 불러오는 중 오류가 발생했어요 💥</p>;
  }

  return (
    <>
      {/* 전체 페이지 Wrapper */}
      {/* h-full: 부모(Layout main.flex-1)가 준 높이 내에서만 꽉 차게 */}
      {/* cf) h-full은 "정확히 부모 높이만큼 고정", min-h-full은 "최소 부모 높이만큼, 필요하면 더 커질 수 있음". */}
      {/* 여기서는 overflow-hidden 주지 않는 게 베스트.. 스크롤 소유권을 MarketPage를 감싸는 Layout 컴포넌트의 main 요소 한 곳에만 주기 위함 */}
      <div
        className={`flex flex-col h-full px-6 bg-[var(--color-bg)] relative ${
          isSidebarOpen || isSearchOpen || isNotificationOpen ? "hidden" : ""
        }`}
      >
        {/* 헤더 (상단 고정) */}
        <header className="sticky top-0 left-0 w-full z-50">
          <SubHeader />
        </header>

        <MarketAddPost isOpen={isDropUpOpen} />

        {/* 메인 컨텐츠 (제품 리스트) */}
        <main className="flex flex-1 overflow-y-auto justify-center">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center text-center gap-12">
              <PropagateLoader color={"#009afa"} />

              <p className="font-medium">{`"${currentUser?.selectedLocation?.keyword[2]}" 주민들의 중고거래 물품 리스트를 불러오는 중이에요.`}</p>
            </div>
          ) : productData.length === 0 ? (
            <div className="flex flex-col justify-center items-center text-center gap-4">
              <p className="font-medium">{`"${currentUser?.selectedLocation?.keyword[2]}" 주민들이 아직 물건을 올리지 않았어요.`}</p>
              <p>첫 거래를 시작해보세요! 🌱</p>
            </div>
          ) : (
            <ProductsList products={productData || []} />
          )}
        </main>
      </div>
    </>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
MarketPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
