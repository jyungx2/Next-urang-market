import SubHeader from "@/components/layout/sub-header";
import MainHeader from "@/components/main/main-header";
import SearchForm from "@/components/main/search-form";
import PostsList from "@/components/market/posts-list";

export default function MarketPage() {
  return (
    <>
      <SubHeader />
      <div className="container">
        <PostsList />
      </div>
    </>
  );
}
