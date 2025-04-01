import EvenPostList from "@/components/community/even-post-list";
import CommunityLayout from "@/pages/community/layout";
import { useRouter } from "next/router";
import OddPostList from "@/components/community/odd-post-list";
import categoryData from "@/data/category";

export default function CommunityPage({ postsEven }) {
  const router = useRouter();
  const { mainCategory } = router.query;

  if (!mainCategory) return null;

  const DUMMY_DATA_ONE = [
    {
      id: 1,
      writer: "김유랑",
      createdAt: "2025.03.13",
      views: 324,
      title: "유랑마켓 중고거래 이용 가이드 (등업 및 이용)",
    },
    {
      id: 2,
      writer: "김유랑",
      createdAt: "2025.02.28",
      views: 56,
      title: "유랑마켓 포인트 적립 꿀팁!",
    },
    {
      id: 3,
      writer: "김유랑",
      createdAt: "2025.02.11",
      views: 1463,
      title: "영국 워홀 총 정리 (자격조건/신청방법/준비서류/eVisa/Vignette 등)",
    },
  ];

  if (mainCategory === "notice" || mainCategory === "working-holiday") {
    return (
      <CommunityLayout>
        <OddPostList items={DUMMY_DATA_ONE} />
      </CommunityLayout>
    );
  }

  if (mainCategory === "working-abroad" || mainCategory === "living-abroad") {
    return (
      <CommunityLayout>
        <EvenPostList items={postsEven} />
      </CommunityLayout>
    );
  }
}

export async function getStaticProps(context) {
  const mainCat = context.params.mainCategory;
  // etStaticProps는 서버에서 실행되므로 절대경로가 필요..
  // fetch("/api/posts")는 브라우저에서는 잘 작동하지만, getStaticProps는 Next.js 서버에서 실행되기 때문에 상대 경로(/api/...)로는 요청을 못 보낸다.

  // fetch()는 그냥 브라우저처럼 URL 요청이기 때문에 넣고 싶은 값을 직접 URL에 붙여줘야 한다.
  // 그래야 api/posts-index.js에서 req.query로 메인 카테고리 값을 꺼내 쓸 수 있음.
  const res = await fetch(
    `http://localhost:3000/api/posts?mainCategory=${mainCat}`
  );
  const data = await res.json();
  console.log(data);

  return {
    props: { postsEven: data.posts },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const paths = categoryData.map((cat) => ({
    params: { mainCategory: cat.slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}
