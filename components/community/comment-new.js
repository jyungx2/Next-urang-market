import useCurrentUserStore from "@/zustand/currentUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRef, useState } from "react";

export default function CommentNew({ postId }) {
  const editableRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const { currentUser } = useCurrentUserStore();
  const queryClient = useQueryClient();

  const handleInput = () => {
    const text = editableRef.current.innerText.trim();
    setIsEmpty(text === "");
  };

  const commentMutation = useMutation({
    mutationFn: async (commentText) => {
      const res = await fetch(`/api/posts/comments?postId=${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          writer: currentUser.nickname,
          profileImage: currentUser.profileImage,
          content: commentText,
        }),
      });
      if (!res.ok) throw new Error("댓글 등록 실패");
      return res.json();
    },
    onSuccess: () => {
      // ✅ 입력창 초기화
      if (editableRef.current) {
        editableRef.current.innerText = "";
        setIsEmpty(true);
      }

      // ✅ SWR 캐시 무효화 (댓글 리스트 다시 불러오기)
      // mutate(`/api/posts/comments?postId=${postId}`);

      // 쿼리 키 무효화 -> 리렌더링 유발
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // useForm 사용하면 자동으로 처리.. 댓글추가는 useRef로 입력값을 받아오기 때문에 별도로 처리 필수

    const commentText = editableRef.current?.innerText.trim();
    if (!commentText) return alert("댓글 내용을 입력해주세요!");
    commentMutation.mutate(commentText);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-amber-50">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-[28px] aspect-square">
              <Image
                src={currentUser?.profileImage}
                alt="icon"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <span className="font-bold text-[1.4rem]">
              {currentUser?.nickname}
            </span>
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
              <Image src="/icons/emoji.svg" alt="icon" width={24} height={24} />
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
            <button
              type="button"
              className="bg-[var(--color-grey-50)] p-3 rounded-lg text-[var(--color-grey-500)] font-bold text-[1.4rem] cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-[var(--color-primary-50)] p-3 rounded-lg text-[var(--color-primary-500)] font-bold text-[1.4rem] cursor-pointer"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
