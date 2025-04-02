import EvenPostList from "@/components/community/even-post-list";
import CommunityLayout from "@/pages/community/layout";
import { useRouter } from "next/router";
import OddPostList from "@/components/community/odd-post-list";
import categoryData from "@/data/category";
import useSWR from "swr";

function getKoreanCategory(mainSlug, subSlug) {
  const main = categoryData.find((cat) => cat.slug === mainSlug);
  const sub = main?.subCategories.find((s) => s.tab === subSlug);

  return {
    mainCategory: main?.name, // "해외살이"
    subCategory: sub?.label, // "친구해요"
  };
}

export default function CommunityPage() {
  const router = useRouter();
  console.log("Community Query: ", router.query);
  const { mainCategory: mainSlug, tab: subSlug } = router.query;
  const { mainCategory, subCategory } = getKoreanCategory(mainSlug, subSlug);

  console.log("🇺🇸 main/sub:", mainSlug, subSlug);

  console.log("🇰🇷 메인/서브:", mainCategory, subCategory);

  // 🚨 mainCategoryegory가 아직 없을 땐 null을 key로 넘겨서 SWR을 멈춘다
  const shouldFetch = !!mainCategory && !!subCategory; // ✅ mainCategoryegory가 있을 때만 fetch

  const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("데이터 요청 실패");
    }
    const data = await res.json();
    return data;
  };

  // 🖍️useSWR은 캐싱기능 보유. mutate()로 기존 데이터 revalidate 해주지 않으면 기존 데이터 가져다 써서 업데이트 불가.
  // ⚠️ refreshInterval은 가능은 하지만 비추천함 - 불필요한 네트워크 요청과 성능 낭비 때문. => 유저의 데이터 요청이 없어도 실행 & 여러 유저가 동시에 사용하면 서버 부하 & 모바일/저사양 디바이스에 부담 & 특정 이벤트 이후만 갱신한다는 CSR 사용목적에 맞지 않음
  // BUT, 실시간 채팅/실시간 알림/주식시세/환율/라이브 스코어 등의 기능에는 유용
  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `/api/posts?mainCategory=${mainCategory}&subCategory=${subCategory}`
      : null,
    fetcher
    // { refreshInterval: 5000 } // 5초마다 자동 갱신
  );

  if (error) {
    return (
      <CommunityLayout>
        <p>💥 데이터를 불러오는 중 오류가 발생했어요 💥</p>
      </CommunityLayout>
    );
  }

  if (isLoading) {
    return (
      <CommunityLayout>
        <p className="text-center font-medium text-[2rem]">
          ⏳ 데이터를 불러오는 중입니다...
        </p>
      </CommunityLayout>
    );
  }

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
  ];

  // mainCategory(Processed data by a customed function, 한국어 카테고리) 기준으로 렌더링
  if (mainCategory === "공지사항" || mainCategory === "워킹홀리데이") {
    return (
      <CommunityLayout>
        <OddPostList items={DUMMY_DATA_ONE} />
      </CommunityLayout>
    );
  }

  // mainSlug(Raw query data, 영어 카테고리) 기준으로 렌더링
  if (mainSlug === "living-abroad" || mainSlug === "working-abroad") {
    return (
      <CommunityLayout>
        <EvenPostList items={data?.posts || []} />
      </CommunityLayout>
    );
  }
}

// export async function getStaticProps(context) {
//   const mainCategory = context.params.mainCategoryegory; // ❌❌server side 함수는 query 속성 사용 불가능!!❌❌❌
//   console.log("context-params", context.params);
//   // etStaticProps는 서버에서 실행되므로 절대경로가 필요..
//   // fetch("/api/posts")는 브라우저에서는 잘 작동하지만, getStaticProps는 Next.js 서버에서 실행되기 때문에 상대 경로(/api/...)로는 요청을 못 보낸다.

//   // fetch()는 그냥 브라우저처럼 URL 요청이기 때문에 넣고 싶은 값을 직접 URL에 붙여줘야 한다.
//   // 그래야 api/posts-index.js에서 req.query로 메인 카테고리 값을 꺼내 쓸 수 있음.
//   const res = await fetch(
//     `http://localhost:3000/api/posts?mainCategoryegory=${mainCategory}`
//   );
//   const data = await res.json();
//   console.log(data);

//   return {
//     props: { postsEven: data.posts },
//     revalidate: 60,
//   };
// }

// export async function getStaticPaths() {
//   const paths = categoryData.map((cat) => ({
//     params: { mainCategoryegory: cat.slug },
//   }));

//   return {
//     paths,
//     fallback: "blocking",
//   };
// }
