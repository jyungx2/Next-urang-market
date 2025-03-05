import AdsSection from "@/components/main/ads-section";
import MainHeader from "@/components/main/main-header";
import PostsSection from "@/components/main/posts-section";
import SearchForm from "@/components/main/search-form";
import Slider from "@/components/main/slider";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>유랑마켓</title>
        <meta
          name="description"
          content="Global second-hand application for Korean living abroad"
        />
      </Head>

      <MainHeader />
      <div className="container">
        <SearchForm />
        <Slider />
        <PostsSection title="워홀준비" />
        <AdsSection />
        <PostsSection title="현지경험담" />
        <PostsSection title="해외취업후기" />
      </div>
    </>
  );
}

// 1) 워홀준비섹션: getStaticProps()로 데이터 페칭 함수 작성 -> props로 넘기기
