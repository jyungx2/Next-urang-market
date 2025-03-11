import SearchPage from "@/components/common/searchPage";
import SubHeader from "@/components/market/sub-header";
import Sidebar from "@/components/common/sidebar";
import PostsList from "@/components/market/posts-list";
import UIContext from "@/store/ui-context";
import { useContext, useEffect } from "react";
import Notification from "@/components/common/notification";

export default function MarketPage() {
  const { isSearchOpen, isNotificationOpen } = useContext(UIContext);

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

  return (
    <>
      <div
        className={`transition-opacity duration-300 
          ${isSearchOpen || isNotificationOpen ? "hidden" : ""}`}
      >
        <div className="relative">
          <SubHeader />
          <Sidebar />
        </div>

        <div className="container">
          <PostsList posts={DUMMY_DATA} />
        </div>
      </div>
      {isSearchOpen && <SearchPage />}
      {isNotificationOpen && <Notification />}
    </>
  );
}
