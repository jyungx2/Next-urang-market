import EvenPostItem from "@/components/community/even-post-item";
import { useRouter } from "next/router";

export default function EvenPostList({ items }) {
  const router = useRouter();
  const { mainCategory, tab } = router.query;

  return (
    <ul className="flex flex-col gap-6">
      {items.map((item) => (
        <EvenPostItem
          key={item._id}
          writer={item.writer}
          createdAt={String(item.createdAt)}
          location={item.location}
          content={item.content}
          onDetail={() =>
            router.push({
              pathname: "/community/[mainCategory]/[postId]",
              query: { mainCategory, postId: item._id, tab },
            })
          }
        />
      ))}
    </ul>
  );
}
