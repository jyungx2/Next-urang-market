import SearchPage from "@/components/common/searchPage";
import SubHeader from "@/components/market/sub-header";
import Sidebar from "@/components/common/sidebar";
import PostsList from "@/components/market/posts-list";
import UIContext from "@/store/ui-context";
import { useContext, useEffect, useState } from "react";
import Notification from "@/components/common/notification";
import AddPost from "@/components/ui/add-post";

export default function MarketPage() {
  const { isSidebarOpen, isSearchOpen, isNotificationOpen } =
    useContext(UIContext);
  const [isDropUpOpen, setIsDropUpOpen] = useState(false);

  // 🖍️특정 컴포넌트에서 렌더링할 데이터는 페이지 단위에서 가져오는 게 SEO측면에서 좋음!
  // 컴포넌트 내부에서 useEffect로 데이터 가져오는 방식(CSR)보단(검색 엔진이 데이터를 가져오기 전에 빈 페이지를 먼저 크롤링할 가능성이 높음. & 구글 검색에 노출되지 않을 가능성이 높아짐.), 페이지 단위에서 데이터를 가져오는 방식(SSR, SSG)이 서버에서 데이터를 가져온 후, 정적 HTML을 생성하기 때문에 검색엔진이 완전한 페이지를 크롤링 가능하게 하여 SEO최적화가 잘 되어 검색노출이 쉬워진다!
  const DUMMY_DATA = [
    {
      id: 1,
      title: "wallet",
      location: "캐나다 캘거리",
      time: "2h",
      price: "2000원",
      chatNum: 24,
      likeNum: 10,
    },
    {
      id: 2,
      title: "rice cooker",
      location: "캐나다 벤쿠버",
      time: "10m",
      price: "40000원",
      chatNum: 49,
      likeNum: 8,
    },
    {
      id: 2,
      title: "rice cooker",
      location: "캐나다 벤쿠버",
      time: "10m",
      price: "40000원",
      chatNum: 49,
      likeNum: 8,
    },
    {
      id: 2,
      title: "rice cooker",
      location: "캐나다 벤쿠버",
      time: "10m",
      price: "40000원",
      chatNum: 49,
      likeNum: 8,
    },
    {
      id: 2,
      title: "rice cooker",
      location: "캐나다 벤쿠버",
      time: "10m",
      price: "40000원",
      chatNum: 49,
      likeNum: 8,
    },
  ];

  // 사이드바 오픈시, 스크롤 막는 코드
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden"; // ✅ 스크롤 막기
    } else {
      document.body.style.overflow = "auto"; // ✅ 스크롤 다시 활성화
    }
  }, [isSearchOpen]);

  const toggleDropUp = () => {
    setIsDropUpOpen(!isDropUpOpen);
  };

  return (
    <>
      {/* 전체 페이지 Wrapper */}
      <div
        className={`flex flex-col min-min-h-screen min-w-[640px] px-6 mx-auto relative bg-[var(--color-bg)] ${
          isSidebarOpen || isSearchOpen || isNotificationOpen ? "hidden" : ""
        }`}
      >
        {/* 헤더 (상단 고정) */}
        <header className="sticky top-0 left-0 w-full">
          <SubHeader />
          <AddPost isOpen={isDropUpOpen} onToggle={toggleDropUp} />
        </header>

        {/* 메인 컨텐츠 (제품 리스트) */}
        <main className="flex-1 overflow-y-auto pb-6">
          <PostsList posts={DUMMY_DATA} />
        </main>
      </div>

      {/* 상태에 따라 표시되는 전역 UI들 */}
      {isSidebarOpen && (
        <div className="bg-black bg-opacity-50 z-40">
          <Sidebar />
        </div>
      )}
      {isSearchOpen && (
        <div className="bg-white z-50">
          <SearchPage />
        </div>
      )}
      {isNotificationOpen && (
        <div className=" z-50">
          <Notification />
        </div>
      )}
    </>
  );
}
