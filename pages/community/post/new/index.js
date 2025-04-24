// pages/community/post/new/onlyCSR.js
import dynamic from "next/dynamic";

// CSR 전용으로 PostAddPage import
const PostAddPage = dynamic(() => import("@/extensions/tiptap/post-add"), {
  ssr: false,
});

export default PostAddPage;
