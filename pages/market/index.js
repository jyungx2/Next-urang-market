import SubHeader from "@/components/layout/sub-header";
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
