import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EvenpostItem({
  postId,
  writer,
  profileImage,
  createdAt,
  content,
  dong,
  onDetail,
  likesCount,
  dislikesCount,
}) {
  const { currentUser, setLikePost, setDislikePost } = useCurrentUserStore();

  const [likes, setLikes] = useState(likesCount);
  const [dislikes, setDislikes] = useState(dislikesCount);

  // 렌더링 시점에서 유저가 이 글을 좋아요 눌렀는지 판단 -> hasLiked는 “현재 로그인한 유저”의 상태에 따라 달라짐 -> 전역상태 currentUser로부터 가져옴
  const initialHasLiked = currentUser?.likes?.includes(postId);
  const initialHasDisliked = currentUser?.dislikes?.includes(postId);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [hasDisliked, setHasDisliked] = useState(initialHasDisliked);

  const isItYouself = writer === currentUser?.nickname;

  // console.log("초기 싫어요", initialHasDisliked);
  // console.log("초기 좋아요", initialHasLiked);
  // console.log("유저 정보: ", currentUser);
  // useEffect(() => console.log("💄 유저 정보:", currentUser), []);

  const handleLikes = async (e) => {
    e.stopPropagation(); // 부모 클릭(onDetail) 방지
    if (hasDisliked) {
      alert("이미 비추천한 글은 추천할 수 없습니다.");
      return;
    }

    if (isItYouself) {
      alert("자신이 작성한 게시글은 추천할 수 없습니다.");
      return;
    }

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
      setLikePost(data.updatedLikes);
    } catch (err) {
      console.error("좋아요 실패❗️", err);
    }
  };

  const handleDisLikes = async (e) => {
    e.stopPropagation(); // 부모 클릭(onDetail) 방지
    if (hasLiked) {
      alert("이미 추천한 글은 비추천할 수 없습니다.");
      return;
    }

    if (isItYouself) {
      alert("자신이 작성한 게시글은 비추천할 수 없습니다.");
      return;
    }

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
      setDislikePost(data.updatedDislikes);
    } catch (err) {
      console.error("좋아요 실패❗️", err.message);
    }
  };

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
          <button className="ml-auto bg-[var(--color-red)] px-3 py-2 rounded-2xl font-bold cursor-pointer hover:bg-[var(--color-red-hover)]">
            삭제
          </button>
        )}
      </div>

      <div id="post-content " className="px-4">
        {content}
      </div>

      <div id="post-footer" className="flex">
        <button
          onClick={handleLikes}
          className="flex items-center gap-2 cursor-pointer p-3"
        >
          <Image
            src={
              initialHasLiked || hasLiked
                ? "/icons/like-filled.svg"
                : "/icons/like.svg"
            }
            alt="icon"
            width={24}
            height={24}
          />
          <span id="like-num">{likes === 0 ? "" : likes}</span>
        </button>

        <button
          onClick={handleDisLikes}
          className="flex items-center gap-2 cursor-pointer p-3"
        >
          <Image
            src={
              initialHasDisliked || hasDisliked
                ? "/icons/dislike-filled.svg"
                : "/icons/dislike.svg"
            }
            alt="icon"
            width={24}
            height={24}
          />
          <span className="dislike-num">{dislikes === 0 ? "" : dislikes}</span>
        </button>
      </div>
    </div>
  );
}
