import PostItem from "@/components/market/post-item";

export default function PostsList({ posts }) {
  return (
    <>
      <ul className="flex flex-col gap-10">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            title={post.title}
            location={post.location}
            time={post.time}
            price={post.price}
            chatNum={post.chatNum}
            likeNum={post.likeNum}
          />
        ))}
      </ul>
    </>
  );
}
