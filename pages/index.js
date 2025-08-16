import AdsSection from "@/components/main/ads-section";
import MainHeader from "@/components/main/main-header";
import PostsSection from "@/components/main/posts-section";
import SearchForm from "@/components/main/search-form";
import Sidebar from "@/components/common/sidebar";
import Slider from "@/components/main/slider";
import { useContext, useEffect } from "react";
import Head from "next/head";
import UIContext from "@/store/ui-context";
import SearchPage from "@/components/common/searchPage";
import Layout from "@/components/layout/layout";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { currentUser } = useCurrentUserStore();

  // 앱 최초 렌더링 시 or 로그인 상태가 아닐 때, /auth로 리다이렉트
  useEffect(() => {
    if (!currentUser) {
      router.replace("/auth");
    }
  }, []);

  const { isSearchOpen, isSidebarOpen } = useContext(UIContext);

  // 사이드바 오픈시, 스크롤 막는 코드
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden"; // ✅ 스크롤 막기
    } else {
      document.body.style.overflow = "auto"; // ✅ 스크롤 다시 활성화
    }
  }, [isSidebarOpen]);

  if (!currentUser) return null;

  return (
    <>
      <Head>
        <title>유랑마켓</title>
        <meta
          name="description"
          content="Global second-hand application for Korean living abroad"
        />
      </Head>

      <div
        className={`bg-[var(--color-bg)] min-h-screen min-w-[640px] p-6 pt-0 flex flex-col gap-7 ${
          isSidebarOpen || isSearchOpen ? "hidden" : ""
        }`}
      >
        <MainHeader />

        <div className="flex flex-col gap-10">
          <SearchForm />
          <Slider />
          <PostsSection title="워홀준비" category="working-holiday" />
          <AdsSection />
          <PostsSection title="현지경험담" category="living-abroad" />
          <AdsSection />
          <PostsSection title="해외취업후기" category="working-abroad" />
        </div>
      </div>
    </>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
Home.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};

// 1) 워홀준비섹션: getStaticProps()로 데이터 페칭 함수 작성 -> props로 넘기기
