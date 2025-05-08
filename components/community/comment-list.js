import CommentItem from "@/components/community/comment-item";

export default function CommentList({ comments }) {
  const list = comments?.map((item) => (
    <CommentItem key={item._id} item={item} />
  ));

  return <ul className="mb-8">{list}</ul>;
}
