import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

export default function CommentItem({ item, postId }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async ({ postId, commentId }) => {
      const res = await fetch(`/api/posts/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, commentId }),
      });

      const data = await res.json();
      console.log(data.message);
    },
    onSuccess: () => {
      // ⭕️쿼리 키 무효화 -> 리렌더링 유발⭕️
      queryClient.invalidateQueries(["comments", postId]);
      alert("댓글이 삭제되었습니다.");
    },
  });

  return (
    <li className="p-4 border-b border-gray-200 font-sans flex gap-2">
      <div className="shrink-0">
        <Image
          src={item.profileImage || ""}
          alt="user"
          className="rounded-full mr-2 aspect-square"
          width={24}
          height={24}
        />
      </div>

      <div className="flex-grow">
        <div className="flex items-center mb-2">
          <div>
            <span className="font-bold text-[1.2rem]">{item.writer}</span>
            <span className="text-[1.2rem] text-gray-500 ml-2">1시간 전</span>
            <span className="bg-red-500 text-white text-[1rem] px-1 py-0.5 rounded-full ml-2">
              N
            </span>
          </div>
          <button
            onClick={() =>
              deleteMutation.mutate({ postId, commentId: item._id })
            }
            className="bg-red-400 p-2 rounded-lg text-white font-bold text-[1.4rem] ml-auto cursor-pointer hover:bg-red-500"
          >
            삭제
          </button>
        </div>

        <div className="text-[1.4rem] mb-4">
          <p>{item.content}</p>
        </div>

        <div className="flex items-center text-[1.2rem] text-gray-600">
          <button className="mr-4 border border-[var(--color-primary-200)] rounded-2xl p-2 text-[var(--color-primary-700)] font-medium cursor-pointer">
            답글쓰기
          </button>

          <div className="ml-auto flex gap-3">
            <button className="flex items-center gap-2 p-2 rounded-3xl cursor-pointer hover:bg-[var(--color-primary-50)]">
              <div className="aspect-square">
                <Image
                  src="/icons/like.svg"
                  alt="icon"
                  width={14}
                  height={14}
                  className="object-contain rounded-full"
                />
              </div>
              <span className="text-[1.4rem]">0</span>
            </button>
            <button className="flex items-center gap-2 p-2 rounded-3xl cursor-pointer hover:bg-[var(--color-primary-50)]">
              <div className="aspect-square">
                <Image
                  src="/icons/dislike.svg"
                  alt="icon"
                  width={14}
                  height={14}
                  className="object-contain rounded-full"
                />
              </div>
              <span className="text-[1.4rem]">0</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
