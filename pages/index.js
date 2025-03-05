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
        <PostsSection />
      </div>
    </>
  );
}
