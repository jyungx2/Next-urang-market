import CommentItem from "@/components/community/comment-item";
import Image from "next/image";
import { useRouter } from "next/router";

export default function PostDetailPage() {
  const router = useRouter();
  console.log(router.query);

  return (
    <div className="flex flex-col gap-4 p-4 pt-0 min-h-screen">
      {/* 헤더 */}
      <div className="grid grid-cols-3 items-center justify-between mb-4 border-b border-[var(--color-grey-100)] p-4">
        <button
          className="relative w-[30px] aspect-square cursor-pointer"
          onClick={() => router.push("/community")}
        >
          <Image
            src="/icons/chevron-left.svg"
            alt="icon"
            fill
            className="object-cover rounded-full"
          />
        </button>
        <h1 className="text-[2rem] font-bold text-center">공지사항</h1>
      </div>

      {/* 프로필 */}
      <div className="flex gap-4 items-center mb-4">
        <div className="relative w-[40px] aspect-square">
          <Image
            src="/images/example.jpg"
            alt="icon"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col gap-1 text-[1.2rem]">
          <div className="flex gap-2">
            <span className="font-bold">you</span>
            <span className="text-[var(--color-primary-600)] font-medium">
              가정동
            </span>
          </div>

          <span className="text-[var(--color-grey-400)]">17시간 전</span>
        </div>

        <button className="ml-auto flex items-center gap-1 border border-[var(--color-grey-100)] rounded-4xl p-2 cursor-pointer">
          <div className="relative w-[12px] aspect-square">
            <Image
              src="/icons/chat-micro.svg"
              alt="icon"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <span className="text-[1.2rem]">채팅</span>
        </button>
      </div>

      {/* 내용물 */}
      <div>
        <p className="text-[1.4rem]">
          시방이나 영종도 말고도 연안부두나 만석부두 등 근처에 짬낚으로 우럭이나
          잡을만한 곳 없을까영?ㅎ 낚금으로 들었는데 전체 다 낚금인가요?
        </p>
      </div>

      {/* 댓글 리셋 & 좋아요 섹션 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 items-center">
          <span className="font-bold text-[1.4rem]">댓글 1</span>

          <button className="cursor-pointer aspect-square bg-[var(--color-grey-50)] p-1 rounded-full">
            <Image
              src="/icons/arrow-path.svg"
              alt="icon"
              width={16}
              height={16}
              className="object-contain rounded-full"
            />
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <button className="flex items-center gap-2 bg-[var(--color-grey-50)] p-2 rounded-3xl cursor-pointer">
            <div className="aspect-square">
              <Image
                src="/icons/like.svg"
                alt="icon"
                width={20}
                height={20}
                className="object-contain rounded-full"
              />
            </div>
            <span className="text-[1.4rem]">2</span>
          </button>

          <button className="flex items-center gap-2 bg-[var(--color-grey-50)] p-2 rounded-3xl cursor-pointer">
            <div className="aspect-square">
              <Image
                src="/icons/dislike.svg"
                alt="icon"
                width={20}
                height={20}
                className="object-contain rounded-full"
              />
            </div>
            <span className="text-[1.4rem]">0</span>
          </button>
        </div>
      </div>

      {/* 댓글 추가 */}
      <div className="mb-4">
        {/* <label>댓글</label> */}
        <input
          type="text"
          placeholder="댓글을 남겨주세요"
          className="border rounded-4xl border-[var(--color-grey-200)] p-2 pl-4 text-[1.4rem] w-full"
        />
      </div>

      {/* 댓글 목록 */}
      <ul>
        <CommentItem />
      </ul>
    </div>
  );
}
