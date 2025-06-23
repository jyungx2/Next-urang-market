import EvenPostList from "@/components/community/even-post-list";
import CommunityLayout from "@/pages/community/layout";
import { useRouter } from "next/router";
import OddPostList from "@/components/community/odd-post-list";
import categoryData from "@/data/category";
import Layout from "@/components/layout/layout";
import UserLocation from "@/components/community/user-location";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useQuery } from "@tanstack/react-query";
import { PropagateLoader } from "react-spinners";

function getKoreanCategory(mainSlug, subSlug) {
  const main = categoryData.find((cat) => cat.slug === mainSlug);
  const sub = main?.subCategories.find((s) => s.tab === subSlug);

  return {
    mainCategory: main?.name, // "해외살이"
    subCategory: sub?.label, // "친구해요"
  };
}

export default function CommunityPage() {
  const { currentUser } = useCurrentUserStore();
  const router = useRouter();
  const rcode = router.query.rcode;

  const { mainCategory: mainSlug, tab: subSlug } = router.query;

  const { mainCategory, subCategory } = getKoreanCategory(mainSlug, subSlug);

  // console.log("🔥 selected-rcode: ", currentUser?.selectedLocation?.rcode);
  // console.log("🔥 location-rcode: ", currentUser?.location?.rcode);

  // console.log("🇺🇸 main/sub:", mainSlug, subSlug);
  // console.log("🇰🇷 메인/서브:", mainCategory, subCategory);

  // 🚨 mainCategoryegory가 아직 없을 땐 null을 key로 넘겨서 SWR을 멈춘다
  const shouldFetch = !!mainCategory && !!subCategory; // ✅ mainCategoryegory가 있을 때만 fetch

  // const fetcher = async (url) => {
  //   const res = await fetch(url);
  //   if (!res.ok) {
  //     throw new Error("데이터 요청 실패");
  //   }
  //   const data = await res.json();
  //   return data;
  // };

  // 🖍️useSWR은 캐싱기능 보유. mutate()로 기존 데이터 revalidate 해주지 않으면 기존 데이터 가져다 써서 업데이트 불가.
  // ⚠️ refreshInterval은 가능은 하지만 비추천함 - 불필요한 네트워크 요청과 성능 낭비 때문. => 유저의 데이터 요청이 없어도 실행 & 여러 유저가 동시에 사용하면 서버 부하 & 모바일/저사양 디바이스에 부담 & 특정 이벤트 이후만 갱신한다는 CSR 사용목적에 맞지 않음
  // BUT, 실시간 채팅/실시간 알림/주식시세/환율/라이브 스코어 등의 기능에는 유용
  // const { data, error, isLoading } = useSWR(
  //   shouldFetch
  //     ? `/api/posts?mainCategory=${mainCategory}&subCategory=${subCategory}&rcode=${
  //         currentUser?.selectedLocation?.rcode || currentUser?.location?.rcode
  //       }`
  //     : null,
  //   fetcher
  //   // { refreshInterval: 5000 } // 5초마다 자동 갱신
  // );

  // useSWR대신 useQuery 사용!
  // 💥 isError는 에러 발생 여부만 알려줌
  // 💥 error는 에러 객체의 실제 정보
  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", mainCategory, subCategory, rcode],
    queryFn: async () => {
      const res = await fetch(
        `/api/posts?mainCategory=${mainCategory}&subCategory=${subCategory}&rcode=${
          currentUser?.selectedLocation?.rcode || currentUser?.location?.rcode
        }`
      );

      if (!res.ok) {
        throw new Error("데이터 요청 실패");
      }
      const data = await res.json();
      return data;
    },
    select: (data) => data.posts,
    enabled: shouldFetch, // 카테고리 정보가 없으면 fetch 막기
  });

  if (isError) {
    console.log(error.message);
    return (
      <CommunityLayout
        userLocationSlot={<UserLocation mainCategory={mainSlug} />}
      >
        <p>💥 데이터를 불러오는 중 오류가 발생했어요 💥</p>
      </CommunityLayout>
    );
  }

  if (isLoading) {
    return (
      <CommunityLayout
        userLocationSlot={<UserLocation mainCategory={mainSlug} />}
      >
        <PropagateLoader color={"#009afa"} />

        <p className="font-medium">{`"${currentUser?.selectedLocation?.keyword[2]}" 주민들의 게시물 리스트를 가져오고 있어요..`}</p>
      </CommunityLayout>
    );
  }

  // mainCategory(Processed data by a customed function, 한국어 카테고리) 기준으로 렌더링
  if (mainCategory === "공지사항") {
    return (
      <CommunityLayout
        userLocationSlot={<UserLocation mainCategory={mainSlug} />}
      >
        <OddPostList items={postData || []} />
      </CommunityLayout>
    );
  }

  // mainSlug(Raw query data, 영어 카테고리) 기준으로 렌더링
  if (
    mainSlug === "living-abroad" ||
    mainSlug === "working-abroad" ||
    mainCategory === "워킹홀리데이"
  ) {
    return (
      <CommunityLayout
        userLocationSlot={<UserLocation mainCategory={mainSlug} />}
      >
        <EvenPostList items={postData || []} />
      </CommunityLayout>
    );
  }
}

// export async function getStaticProps(context) {
//   const mainCategory = context.params.mainCategory; // ❌❌server side 함수는 query 속성 사용 불가능!!❌❌❌ -> path parameter인 mainCategory만 받을 수 있고, 실질적인 데이터 구분점인 subCategory는 못받기 때문에, SSR, ISR(SSG) 불가능.
// -> 🌟🌟🌟query string이 관여하는 데이터 페칭 로직은 CSR으로만 가능!!🌟🌟🌟
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

// ✅ Layout 적용되도록 getLayout 설정
CommunityPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>; // Layout 안 씌움
};
