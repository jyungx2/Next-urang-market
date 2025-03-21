import MainCategory from "@/components/community/mainCat";
import NoticePostItem from "@/components/community/notice-post-item";
import SubCategory from "@/components/community/subCat";
import UserLocation from "@/components/community/user-location";
import CommunityAddPost from "@/components/ui/community-addPost";

export default function CommunityPage() {
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
    <div className="min-h-screen bg-[var(--color-bg)] relative">
      <div id="neighborhood_menu" className="flex flex-col gap-8 p-4">
        <UserLocation />
        <MainCategory />
        <div className="fixed bottom-300 left-1/2 -translate-x-1/2 w-full max-w-[640px] px-6 z-50">
          <CommunityAddPost />
        </div>
      </div>

      <div id="neighborhood_routed_area" className="flex flex-col p-3">
        <SubCategory />

        <ul className="flex flex-col gap-6">
          {DUMMY_DATA.map((item) => (
            <NoticePostItem
              key={item.id}
              writer={item.writer}
              createdAt={String(item.createdAt)}
              views={item.views}
              title={item.title}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
