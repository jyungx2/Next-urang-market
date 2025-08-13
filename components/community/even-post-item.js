import useCurrentUserStore from "@/zustand/currentUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function EvenpostItem({
  postId,
  writer,
  profileImage,
  createdAt,
  content,
  dong,
  onDetail,
  initialLikesCount,
  initialDislikesCount,
  userHasLiked,
  userHasDisliked,
}) {
  const { currentUser } = useCurrentUserStore();
  const queryClient = useQueryClient();

  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [dislikesCount, setDislikesCount] = useState(initialDislikesCount);

  // 렌더링 시점에서 유저가 이 글을 좋아요 눌렀는지 판단 -> hasLiked는 “현재 로그인한 유저”의 상태에 따라 달라짐 -> 전역상태 currentUser로부터 가져옴 => ✨✨서버에서 계산할 예정✨✨
  const [hasLiked, setHasLiked] = useState(userHasLiked);
  const [hasDisliked, setHasDisliked] = useState(userHasDisliked);
  // const initialhasDisliked = currentUser?.dislikes?.includes(postId);

  const isItYouself = writer === currentUser?.nickname;

  const likePostMutation = useMutation({
    mutationFn: async () => {
      if (isItYouself) {
        alert("자신이 작성한 게시글은 추천할 수 없습니다.");
        return; // ❌ 여기서 끝내도 reject가 아님 -> onSuccess가 실행됨
      }

      if (hasDisliked) {
        alert("이미 비추천한 글은 추천할 수 없습니다.");
        return; // ❌ 여기서 끝내도 reject가 아님 -> onSuccess가 실행됨
      }

      const res = await fetch(`/api/posts/likes`, {
        method: "POST",
        body: JSON.stringify({ userId: currentUser?.id, postId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "좋아요 반영 실패");
      }

      const data = await res.json();
      // alert("좋아요 성공:", data);
      // setLikePost(data.updatedLikes); // ❌ likesCount는 서버에서 계산해서 보내주므로, 여기서 setLikePost는 필요 없음
      setLikesCount(data.likesCount);
      setHasLiked(data.liked);
    },
    onSuccess: () => {
      // 💡 posts 리스트 새로고침 → likesCount / liked 상태 자동 반영
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // prefix 매칭으로 모두 무효화

      // 필요하면 상세페이지 캐시도 무효화 가능
      queryClient.invalidateQueries(["post", postId]);
    },
    onError: (error) => {
      console.error("좋아요 실패:", error);
      alert("좋아요 반영에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const dislikePostMutation = useMutation({
    mutationFn: async () => {
      if (isItYouself) {
        alert("자신이 작성한 게시글은 추천할 수 없습니다.");
        return; // ❌ 여기서 끝내도 reject가 아님 -> onSuccess가 실행됨
      }

      if (hasLiked) {
        alert("이미 추천한 글은 비추천할 수 없습니다.");
        return; // ❌ 여기서 끝내도 reject가 아님 -> onSuccess가 실행됨
      }

      const res = await fetch(`/api/posts/dislikes`, {
        method: "POST",
        body: JSON.stringify({ userId: currentUser?.id, postId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "싫어요 반영 실패");
      }

      const data = await res.json();
      // alert("싫어요 성공:", data);
      // setLikePost(data.updatedLikes); // ❌ dislikesCount는 서버에서 계산해서 보내주므로, 여기서 setLikePost는 필요 없음
      setDislikesCount(data.dislikesCount);
      setHasDisliked(data.disliked);
    },
    onSuccess: () => {
      // 💡 posts 리스트 새로고침 → likesCount / liked 상태 자동 반영
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // prefix 매칭으로 모두 무효화

      // 필요하면 상세페이지 캐시도 무효화 가능
      queryClient.invalidateQueries(["post", postId]);
    },
    onError: (error) => {
      console.error("싫어요 실패:", error);
      alert("싫어요 반영에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "삭제 실패");
      }
    },
    onSuccess: () => {
      alert("게시물이 성공적으로 삭제되었습니다.");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      alert(`오류 발생: ${error.message}`);
    },
  });

  return (
    <div
      className="flex flex-col gap-4 border-t-[10px] border-[var(--color-grey-100)] cursor-pointer"
      onClick={onDetail}
    >
      <div
        id="post-header"
        className="flex gap-4 items-center text-[1.2rem] px-4 pt-4"
      >
        <Link href="/" className="flex gap-2 items-center">
          <Image
            src={profileImage || "/icons/profile-signup.svg"}
            alt="icon"
            width={24}
            height={24}
            className="rounded-full aspect-square object-cover"
          />
          <span className="font-bold">{writer}</span>
        </Link>

        <span className="text-gray-500">{createdAt.split("T")[0]}</span>
        <span className="flex items-center">
          <Image
            src="/icons/location-micro.svg"
            alt="icon"
            width={14}
            height={14}
          />
          {dong}
        </span>

        {/* ♻️ nickname이 아닌, user객체를 통째로 Prop으로 받아와 id로 비교하는게 더 안정적이지 않을까? */}
        {currentUser.nickname === writer && (
          <button
            className="ml-auto bg-[var(--color-red)] px-3 py-2 rounded-2xl font-bold cursor-pointer hover:bg-[var(--color-red-hover)]"
            onClick={(e) => {
              e.stopPropagation(); // 🔥 상세페이지 진입 방지!
              deletePostMutation.mutate(postId);
            }}
          >
            삭제
          </button>
        )}
      </div>

      <div id="post-content " className="px-4">
        {content}
      </div>

      <div id="post-footer" className="flex">
        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ 부모 onClick으로 버블링 방지
            likePostMutation.mutate();
          }}
          className="flex items-center gap-2 cursor-pointer p-3"
        >
          <Image
            src={hasLiked ? "/icons/like-filled.svg" : "/icons/like.svg"}
            alt="icon"
            width={24}
            height={24}
          />
          <span id="like-num">{likesCount}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ 부모 onClick으로 버블링 방지
            dislikePostMutation.mutate();
          }}
          className="flex items-center gap-2 cursor-pointer p-3"
        >
          <Image
            src={
              hasDisliked ? "/icons/dislike-filled.svg" : "/icons/dislike.svg"
            }
            alt="icon"
            width={24}
            height={24}
          />
          <span className="dislike-num">{dislikesCount}</span>
        </button>
      </div>
    </div>
  );
}
