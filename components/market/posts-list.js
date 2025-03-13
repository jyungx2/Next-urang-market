import PostItem from "@/components/market/post-item";

import { useRouter } from "next/router";

export default function PostsList({ posts }) {
  const router = useRouter();

  const linkToPostDetailPageHandler = (postId) => {
    router.push(`/market/${postId}`);
  };

  return (
    <>
      <ul className="flex flex-col gap-10">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex gap-8 bg-[var(--color-primary-50)] rounded-2xl px-4 py-8 cursor-pointer"
            onClick={() => linkToPostDetailPageHandler(post.id)}
          >
            <PostItem
              key={post.id}
              title={post.title}
              location={post.location}
              time={post.time}
              price={post.price}
              chatNum={post.chatNum}
              likeNum={post.likeNum}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

{
  /* <Link
  href={{ pathname: "/market/[id]", query: { id: post.id } }}
  onClick={toggleProductPage}
></Link>; */
}
