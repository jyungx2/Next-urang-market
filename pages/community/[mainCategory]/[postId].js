import CommentItem from "@/components/community/comment-item";
import Layout from "@/components/layout/layout";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function PostDetailPage({ selectedPost }) {
  const router = useRouter();
  const { mainCategory, tab } = router.query;

  const editableRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleInput = () => {
    const text = editableRef.current.innerText.trim();
    setIsEmpty(text === "");
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-0 min-h-screen">
      {/* 헤더 */}
      <div className="grid grid-cols-3 items-center justify-between mb-4 border-b border-[var(--color-grey-100)] p-4">
        <button
          className="relative w-[30px] aspect-square cursor-pointer"
          onClick={() =>
            router.push({
              pathname: "/community/[mainCategory]",
              query: { mainCategory, tab },
            })
          }
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
            src={selectedPost.profileImage}
            alt="icon"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col gap-1 text-[1.2rem]">
          <div className="flex gap-2">
            <span className="font-bold">{selectedPost.writer}</span>
            <span className="text-[var(--color-primary-600)] font-medium">
              {selectedPost.dong}
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
        <p className="text-[1.4rem]">{selectedPost.content}</p>
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
        <div className="bg-amber-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-[28px] aspect-square">
                <Image
                  src="/images/example.jpg"
                  alt="icon"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <span className="font-bold text-[1.4rem]">jiyoung</span>
            </div>

            <span className="text-[var(--color-grey-400)] text-[1.2rem]">
              0/500
            </span>
          </div>

          <div
            ref={editableRef}
            role="textbox"
            aria-label="댓글 입력창"
            contentEditable
            className={`textarea ${isEmpty ? "empty" : ""}`}
            placeholder="댓글을 남겨주세요"
            onInput={handleInput}
          ></div>

          <div className="flex mt-2 justify-between">
            <div className="flex gap-4 items-center">
              <button className="cursor-pointer">
                <Image
                  src="/icons/emoji.svg"
                  alt="icon"
                  width={24}
                  height={24}
                />
              </button>
              <button className="cursor-pointer">
                <Image
                  src="/icons/camera.svg"
                  alt="icon"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-[var(--color-grey-50)] p-3 rounded-lg text-[var(--color-grey-500)] font-bold text-[1.4rem] cursor-pointer">
                취소
              </button>
              <button className="bg-[var(--color-primary-50)] p-3 rounded-lg text-[var(--color-primary-500)] font-bold text-[1.4rem] cursor-pointer">
                등록
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <ul>
        <CommentItem />
      </ul>
    </div>
  );
}

// ✅ 해당 URL에 어떤 데이터를 넘길지 결정
// api/posts/[postId] - getDocumentById(): 각 경로에서 필요한 개별 게시글 데이터를 가져오는 용도 (특정 post의 id로 상세 데이터 요청)
export async function getStaticProps(context) {
  const postId = context.params.postId;

  const res = await fetch(`http://localhost:3000/api/posts/${postId}`);

  const data = await res.json();
  console.log(postId, res, data);

  if (!data.post) {
    return {
      notFound: true, // 404 페이지로 이동
    };
  }

  return {
    props: { selectedPost: data.post },
    // revalidate: 60,
  };
}

// ✅ 어떤 URL을 빌드할지 결정 -> 모든 post의 mainCategory, postId 명시
export async function getStaticPaths() {
  const res = await fetch("http://localhost:3000/api/posts");
  const data = await res.json();

  const paths = data.posts.map((post) => ({
    params: {
      mainCategory: post.mainCategory,
      postId: post._id.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

// ✅ Layout 적용되도록 getLayout 설정
PostDetailPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>; // Layout 안 씌움
};
