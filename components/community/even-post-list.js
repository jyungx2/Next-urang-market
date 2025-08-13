import EvenPostItem from "@/components/community/even-post-item";
import { useRouter } from "next/router";

export default function EvenPostList({ items }) {
  const router = useRouter();
  const { mainCategory, tab } = router.query;

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <EvenPostItem
          key={item._id}
          postId={item._id}
          createdAt={String(item.createdAt)}
          writer={item.writer}
          profileImage={item.profileImage}
          title={item.title}
          content={item.content}
          dong={item.dong}
          onDetail={() =>
            router.push({
              pathname: "/community/[mainCategory]/[postId]",
              query: { mainCategory, postId: item._id, tab },
            })
          }
          // likesCount, dislikesCount는 게시글 자체의 속성이므로 prop으로 넘겨주기
          initialLikesCount={item.likesCount}
          initialDislikesCount={item.dislikesCount}
          userHasLiked={item.userHasLiked}
          userHasDisliked={item.userHasDisliked}
        />
      ))}
    </ul>
  );
}
