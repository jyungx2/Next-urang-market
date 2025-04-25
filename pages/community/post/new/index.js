// pages/community/post/new/onlyCSR.js
import Layout from "@/components/layout/layout";
import dynamic from "next/dynamic";

// CSR 전용으로 PostAddPage import
const PostAddPage = dynamic(() => import("@/extensions/tiptap/post-add"), {
  ssr: false,
});

// ✅ Layout 적용되도록 getLayout 설정
PostAddPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PostAddPage;
