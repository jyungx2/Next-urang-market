import SearchPage from "@/components/common/searchPage";
import SubHeader from "@/components/market/sub-header";
import Sidebar from "@/components/common/sidebar";
import PostsList from "@/components/market/posts-list";
import UIContext from "@/store/ui-context";
import { useContext, useEffect, useState } from "react";
import Notification from "@/components/common/notification";
import AddPost from "@/components/ui/add-post";
import DropUp from "@/components/ui/drop-up";

export default function MarketPage() {
  const { isSidebarOpen, isSearchOpen, isNotificationOpen } =
    useContext(UIContext);
  const [isDropUpOpen, setIsDropUpOpen] = useState(false);

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
          <DropUp isOpen={isDropUpOpen} />
          <AddPost onToggle={toggleDropUp} />
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
