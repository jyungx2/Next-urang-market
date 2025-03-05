import MainHeader from "@/components/main/main-header";
import SearchForm from "@/components/main/search-form";
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
        <main className="main">
          <SearchForm />
          <article>게시물</article>
        </main>
      </div>
    </>
  );
}
