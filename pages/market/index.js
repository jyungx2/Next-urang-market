import MainHeader from "@/components/main/main-header";
import SearchForm from "@/components/main/search-form";

export default function StayPage() {
  return (
    <div className="container">
      <main className="main">
        <SearchForm />
        <article>게시물</article>
      </main>
    </div>
  );
}
