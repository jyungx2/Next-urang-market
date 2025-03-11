import AdsSection from "@/components/main/ads-section";
import MainHeader from "@/components/main/main-header";
import PostsSection from "@/components/main/posts-section";
import SearchForm from "@/components/main/search-form";
import Sidebar from "@/components/common/sidebar";
import Slider from "@/components/main/slider";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <Head>
        <title>유랑마켓</title>
        <meta
          name="description"
          content="Global second-hand application for Korean living abroad"
        />
      </Head>

      <div className="relative">
        <MainHeader
          onMenuClick={() => setIsSidebarOpen((prevState) => !prevState)}
          isOpen={isSidebarOpen}
        />
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      <div className="container">
        <SearchForm />
        <Slider />
        <PostsSection title="워홀준비" />
        <AdsSection />
        <PostsSection title="현지경험담" />
        <AdsSection />
        <PostsSection title="해외취업후기" />
      </div>
    </>
  );
}

// 1) 워홀준비섹션: getStaticProps()로 데이터 페칭 함수 작성 -> props로 넘기기
