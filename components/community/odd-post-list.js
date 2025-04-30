import OddPostItem from "@/components/community/odd-post-item";
import { useRouter } from "next/router";

export default function OddPostList({ items }) {
  const router = useRouter();
  const { mainCategory, tab } = router.query;

  return (
    <ul className="flex flex-col gap-6">
      {items.map((item) => (
        <OddPostItem
          key={item.id}
          writer={item.writer}
          createdAt={String(item.createdAt)}
          views={item.views}
          title={item.title}
          onDetail={() =>
            router.push({
              // 동적 페이지 관련 URL 변수 ([id], [slug] 등)는 pathname에 직접 문자열로 넣기보단, query 객체로 분리해서 넘기는 것이 가독성과 유지보수 측면👍
              pathname: "/community/[mainCategory]/[postId]",
              query: { mainCategory, postId: item._id, tab },
            })
          }
        />
      ))}
    </ul>
  );
}
