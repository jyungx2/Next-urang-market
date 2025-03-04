import MainNav from "@/components/layout/main-nav";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="container">
        <header className="header">
          <section className="headerSection">
            <div>
              <Image src="/favicon.ico" alt="image" width="60" height="60" />
            </div>
            <div className="headerRight">
              <Image
                src="/icons/alarm.svg"
                alt="image"
                width={32}
                height={32}
              />
              <Link href="/">
                <Image
                  src="/icons/menu.svg"
                  alt="image"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </section>
        </header>

        <main className="main">
          <form className="searchForm">
            <button>
              <div className="searchButton">
                <span>중고거래</span>
                <Image
                  src="/icons/triangle.svg"
                  alt="image"
                  width={18}
                  height={18}
                />
              </div>
            </button>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search"
              />
              <button>
                <Image
                  src="/icons/search.svg"
                  alt="image"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </form>

          <article>게시물</article>
        </main>

        <MainNav />
      </div>
    </>
  );
}
