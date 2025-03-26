import ExcPostItem from "@/components/community/talk-post-item";

export default function CommunityPage() {
  const DUMMY_DATA = [
    {
      id: 1,
      writer: "김초밥",
      createdAt: "2025.03.13",
      location: "캐나다 캘거리",
      content: "벤쿠버 부모님 모시고 가기 좋은 한인식당 추천해주세요.",
    },
    {
      id: 2,
      writer: "김어묵",
      location: "캐나다 벤쿠버",
      createdAt: "2025.03.20",
      content:
        "프랑스어 공부하시는 분 계실까요? 프랑스어 유학연수로 프랑스 대신 몬트리올 유학 괜찮나요",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div id="neighborhood_routed_area" className="flex flex-col px-4">
        <div className="flex flex-col gap-2">
          {DUMMY_DATA.map((item) => (
            <ExcPostItem
              key={item.id}
              writer={item.writer}
              createdAt={item.createdAt}
              location={item.location}
              content={item.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
