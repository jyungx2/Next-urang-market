import Image from "next/image";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-amber-200">
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
          <div className="flex flex-col gap-6 border-t-[10px] border-[var(--color-bg)] p-4">
            <div
              id="post-header"
              className="flex gap-4 items-center text-[1.2rem]"
            >
              <Link href="/" className="flex gap-2 items-center">
                <Image
                  src="/images/example.jpg"
                  alt="icon"
                  width={24}
                  height={24}
                  className="rounded-full aspect-square object-cover"
                />
                <span className="font-bold">김초밥</span>
              </Link>

              <span className="text-gray-500">2025.03.13</span>
              <span className="flex items-center">
                <Image
                  src="/icons/location-micro.svg"
                  alt="icon"
                  width={14}
                  height={14}
                />
                효성동
              </span>
            </div>

            <Link href="/" id="post-content" className="">
              벤쿠버 부모님 모시고 가기 좋은 한인식당 추천해주세요.
            </Link>

            <div id="post-footer" className="flex gap-6">
              <button className="flex items-center gap-2">
                <Image
                  src="/icons/like-filled.svg"
                  alt="icon"
                  width={24}
                  height={24}
                />
                <span id="like-num">1</span>
              </button>

              <button className="flex items-center gap-2">
                <Image
                  src="/icons/dislike.svg"
                  alt="icon"
                  width={24}
                  height={24}
                />
                <span className="dislike-num"></span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 border-t-[10px] border-[var(--color-bg)] p-4">
            <div
              id="post-header"
              className="flex gap-4 items-center text-[1.2rem]"
            >
              <Link href="/" className="flex gap-2 items-center">
                <Image
                  src="/images/example.jpg"
                  alt="icon"
                  width={24}
                  height={24}
                  className="rounded-full aspect-square object-cover"
                />
                <span className="font-bold">김초밥</span>
              </Link>

              <span className="text-gray-500">2025.03.13</span>
              <span className="flex items-center">
                <Image
                  src="/icons/location-micro.svg"
                  alt="icon"
                  width={14}
                  height={14}
                />
                효성동
              </span>
            </div>

            <Link href="/" id="post-content" className="">
              벤쿠버 부모님 모시고 가기 좋은 한인식당 추천해주세요.
            </Link>

            <div id="post-footer" className="flex gap-6">
              <button className="flex items-center gap-2">
                <Image
                  src="/icons/like-filled.svg"
                  alt="icon"
                  width={24}
                  height={24}
                />
                <span id="like-num">1</span>
              </button>

              <button className="flex items-center gap-2">
                <Image
                  src="/icons/dislike.svg"
                  alt="icon"
                  width={24}
                  height={24}
                />
                <span className="dislike-num"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
