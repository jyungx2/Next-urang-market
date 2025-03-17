import ExcPostItem from "@/components/community/exc-post-item";
import Image from "next/image";
import Link from "next/link";

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
      <div id="neighborhood_menu" className="flex flex-col gap-8 p-4">
        <div className="flex justify-between">
          <button className="flex items-center cursor-pointer">
            <Image
              src="/icons/location.svg"
              alt="icon"
              width={20}
              height={20}
            />
            <h3 className="font-bold text-[1.6rem] ml-2">효성동 이웃</h3>
            <Image
              src="/icons/chevron-down-micro.svg"
              alt="icon"
              width={14}
              height={14}
            />
          </button>

          <Link href="/" className="relative w-[30px] aspect-square">
            <Image
              src="/images/example.jpg"
              alt="icon"
              fill
              className="rounded-full object-cover"
            />
          </Link>
        </div>

        <div className="flex gap-2">
          <button className="rounded-4xl border-none bg-[var(--color-primary-50)] text-[var(--color-primary-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer">
            공지사항
          </button>
          <button className="rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer">
            해외살이
          </button>
          <button className="rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer">
            워킹홀리데이
          </button>
          <button className="rounded-4xl border-none bg-[var(--color-gray-50)] text-[var(--color-gray-600)] py-4 px-6 font-bold text-[1.4rem] cursor-pointer">
            해외취업
          </button>
        </div>
      </div>

      <div id="neighborhood_routed_area" className="flex flex-col px-4">
        <div className="flex gap-4 mb-6">
          {/* 상단 버튼에 의해 필터링되는 2차 카테고리
          워홀: 필독공지/비자승인/경험공유
          해외취업: 성공후기/조언구해요 */}
          <div className="flex gap-6">
            <button
              role="tab"
              className="font-medium p-2 border-b-2 border-[var(--color-primary-600)] text-[1.4rem] text-[var(--color-primary-600)] cursor-pointer"
            >
              <span>현지생활</span>
            </button>
            <button
              role="tab"
              className="font-medium p-2 text-[1.4rem] cursor-pointer"
            >
              <span>현지맛집</span>
            </button>
            <button
              role="tab"
              className="font-medium p-2 text-[1.4rem] cursor-pointer"
            >
              <span>꿀팁공유</span>
            </button>
            <button
              role="tab"
              className="font-medium p-2 text-[1.4rem] cursor-pointer"
            >
              <span>친구해요</span>
            </button>
          </div>
        </div>

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
