import NoticePostItem from "@/components/community/notice-post-item";
import CommunityLayout from "@/pages/community/layout";
import { useRouter } from "next/router";

export default function CommunityPage() {
  const router = useRouter();
  const { tab } = router.query;
  console.log("query string of tab", tab);

  const DUMMY_DATA = [
    {
      id: 1,
      writer: "김유랑",
      createdAt: "2025.03.13",
      views: 324,
      title: "유랑마켓 중고거래 이용 가이드 (등업 및 이용)",
    },
    {
      id: 2,
      writer: "김유랑",
      createdAt: "2025.02.28",
      views: 56,
      title: "유랑마켓 포인트 적립 꿀팁!",
    },
    {
      id: 3,
      writer: "김유랑",
      createdAt: "2025.02.11",
      views: 1463,
      title: "영국 워홀 총 정리 (자격조건/신청방법/준비서류/eVisa/Vignette 등)",
    },
  ];

  return (
    <CommunityLayout>
      <ul className="flex flex-col gap-6">
        {DUMMY_DATA.map((item) => (
          <NoticePostItem
            key={item.id}
            writer={item.writer}
            createdAt={String(item.createdAt)}
            views={item.views}
            title={item.title}
            onDetail={() =>
              router.push({
                pathname: `/community/${item.id}`,
                query: { tab },
              })
            }
          />
        ))}
      </ul>
    </CommunityLayout>
  );
}
