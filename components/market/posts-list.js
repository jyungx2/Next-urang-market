import PostItem from "@/components/market/post-item";
import UIContext from "@/store/ui-context";
import Link from "next/link";
import { useContext } from "react";

export default function PostsList({ posts }) {
  const { toggleProductPage } = useContext(UIContext);

  return (
    <>
      <ul className="flex flex-col gap-10">
        {posts.map((post) => (
          <li key={post.id} onClick={toggleProductPage}>
            <Link
              className="flex gap-8 bg-[var(--color-primary-50)] rounded-2xl px-4 py-8 cursor-pointer"
              href={{ pathname: "/market/[id]", query: { id: post.id } }}
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
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
