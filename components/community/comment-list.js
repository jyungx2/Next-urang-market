import CommentItem from "@/components/community/comment-item";
import useSWR from "swr";

export default function CommentList({ postId }) {
  const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("데이터 요청 실패");
    }
    const data = await res.json();
    return data;
  };

  const { data, error } = useSWR(
    `/api/posts/comments?postId=${postId}`,
    fetcher
  );

  if (!data) return <p>Loading...</p>;
  if (error) return <p>Failed to load comments</p>;

  const list = data.comments?.map((item) => (
    <CommentItem key={item._id} item={item} />
  ));

  return <ul className="mb-8">{list}</ul>;
}
