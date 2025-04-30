import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function EvenpostItem({
  postId,
  writer,
  createdAt,
  content,
  dong,
  onDetail,
  likesCount,
  dislikesCount,
}) {
  const { currentUser } = useCurrentUserStore();

  const [likes, setLikes] = useState(likesCount);
  const [dislikes, setDislikes] = useState(dislikesCount);

  // 렌더링 시점에서 유저가 이 글을 좋아요 눌렀는지 판단 -> hasLiked는 “현재 로그인한 유저”의 상태에 따라 달라짐 -> 전역상태 currentUser로부터 가져옴
  const initialHasLiked = currentUser?.likes?.includes(postId);
  const initialHasDisliked = currentUser?.dislikes?.includes(postId);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [hasDisliked, setHasDisliked] = useState(initialHasDisliked);

  const handleLikes = async (e) => {
    e.stopPropagation(); // 부모 클릭(onDetail) 방지

    try {
      const res = await fetch(`/api/posts/likes`, {
        method: "POST",
        body: JSON.stringify({ userId: currentUser.id, postId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to like");

      const data = await res.json();
      console.log("data from server", data);

      setLikes(data.likesCount);
      setHasLiked(data.liked);
    } catch (err) {
      console.error("좋아요 실패❗️", err);
    }
  };

  const handleDisLikes = async (e) => {
    e.stopPropagation(); // 부모 클릭(onDetail) 방지

    try {
      const res = await fetch(`/api/posts/dislikes`, {
        method: "POST",
        body: JSON.stringify({ userId: currentUser.id, postId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to dislike");

      const data = await res.json();
      setDislikes(data.dislikesCount);
      setHasDisliked(data.disliked);
    } catch (err) {
      console.error("좋아요 실패❗️", err.message);
    }
  };

  return (
    <div
      className="flex flex-col gap-6 border-t-[10px] border-[var(--color-grey-100)] p-4 cursor-pointer"
      onClick={onDetail}
    >
      <div id="post-header" className="flex gap-4 items-center text-[1.2rem]">
        <Link href="/" className="flex gap-2 items-center">
          <Image
            src={currentUser?.profileImage || "/icons/profile-signup.svg"}
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
      </div>

      <div id="post-content">{content}</div>

      <div id="post-footer" className="flex gap-6">
        <button
          onClick={handleLikes}
          className="flex items-center gap-2 cursor-pointer hover:bg-amber-400"
        >
          <Image src="/icons/like.svg" alt="icon" width={24} height={24} />
          <span id="like-num">{likes}</span>
        </button>

        <button
          onClick={handleDisLikes}
          className="flex items-center gap-2 cursor-pointer hover:bg-amber-400"
        >
          <Image src="/icons/dislike.svg" alt="icon" width={24} height={24} />
          <span className="dislike-num">{dislikes}</span>
        </button>
      </div>
    </div>
  );
}
