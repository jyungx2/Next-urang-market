import SubHeader from "@/components/layout/sub-header";
import Sidebar from "@/components/main/sidebar";
import PostsList from "@/components/market/posts-list";
import { useEffect, useState } from "react";

export default function MarketPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarOverall, setIsSidebarOverall] = useState(false);

  const DUMMY_DATA = [
    {
      id: 1,
      title: "wallet",
      location: "캐나다 캘거리",
      time: "2h",
      price: "2000원",
    },
    {
      id: 2,
      title: "rice cooker",
      location: "캐나다 벤쿠버",
      time: "10m",
      price: "40000원",
    },
  ];

  const menuOpenHandler = () => {
    setIsSidebarOpen((prevState) => !prevState);
    setIsSidebarOverall((prevState) => !prevState);
  };

  // 사이드바 오픈시, 스크롤 막는 코드
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden"; // ✅ 스크롤 막기
    } else {
      document.body.style.overflow = "auto"; // ✅ 스크롤 다시 활성화
    }
  }, [isSidebarOpen]);

  return (
    <>
      <div className="relative">
        <SubHeader onMenuClick={menuOpenHandler} isOverall={isSidebarOverall} />
        <Sidebar isOpen={isSidebarOpen} isOverall={isSidebarOverall} />
      </div>

      <div className="container">
        <PostsList posts={DUMMY_DATA} />
      </div>
    </>
  );
}
