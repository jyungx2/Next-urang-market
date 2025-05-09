import CommentItem from "@/components/community/comment-item";

export default function CommentList({ comments, postId }) {
  const list = comments?.map((item) => (
    <CommentItem key={item._id} item={item} postId={postId} />
  ));

  return <ul className="mb-8">{list}</ul>;
}
