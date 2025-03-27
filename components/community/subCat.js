import { useRouter } from "next/router";
import categoryData from "@/data/category";
import { useEffect, useMemo } from "react";

export default function SubCategory() {
  const router = useRouter();
  const pathname = router.pathname;

  const { tab } = router.query;

  const currentMainCat = categoryData.find((cat) => cat.path === pathname);

  // 💥 문제: subCategories = []가 렌더링마다 새 배열을 만들어 useEffect가 계속 실행될 수 있음...
  // **현재는 !category 조건이 있어서 괜찮지만(어느 서브카테고리를 누르든, useRouter().push()로 query string을 지정해줬으므로..), if (subCategories.length > 0)만 쓰면 다른 서브카테고리 눌러도 다시 첫번째 서브카테고리로 리셋될 수 있음 (실제로 클릭한 서브카테고리가 active 됐다가 다시 결국엔 첫번째 서브카테고리가 active되는 걸 볼 수 있음.)** ➡️ 현재는 괜찮지만 미래에 위험해질 수도 있으니 미리 방어하자는 의미로 useMemo()를 통해 특정 밸류를 기억하여 참조값이 변경되는 것을 방지하자!
  // ✅ 해결: useMemo로 ✨배열을 메모이제이션✨해서 참조값 유지 => useEffect의 의존성 경고를 없애고 예측 가능한 동작을 보장.
  // 🖍️ 결과: useEffect 의존성 배열ㄴ이 안정적(새로운 참조값 생성하지 않아 불필요한 렌더링 방지, 의도하지 않은 결과 방지 가능)이 되고, 불필요한 실행 방지
  const subCategories = useMemo(() => {
    return currentMainCat?.subCategories || [];
  }, [currentMainCat]);

  useEffect(() => {
    if (!tab && subCategories.length > 0) {
      // tab 쿼리가 없을 때 첫 번째 서브카테고리로 설정
      // replace(): 현재 URL만 교체 → 깔끔함 & push로 하면 "브라우저 히스토리에 추가됨 → 뒤로가기 불편해지는 현상" 방지.
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: subCategories[0].tab },
        },
        undefined,
        { shallow: false }
        // true로 하면... 서버에서 새 HTML/데이터를 가져오지 않고, 클라이언트에서만 리렌더링 발생
        // 즉, 라우팅 경로(pathname)는 동일하게 유지하면서, query string만 변경할 때, getServerSideProps, getStaticProps, getInitialProps 등을 다시 실행하지 않게 함..
        // 💥단! useSWR(), useEffect()처럼 클라이언트에서 "query를 기반으로 fetch"하는 로직은 정상 작동함)
      );
    }
  }, [tab, subCategories, router]);

  return (
    <div id="category-2" className="flex gap-6 mb-8">
      {/* 상단 버튼에 의해 필터링되는 2차 카테고리
          워홀: 필독공지/비자승인/경험공유
          해외취업: 성공후기/조언구해요 */}

      {subCategories.map((cat) => {
        const isActive = tab === cat.tab;
        return (
          <button
            key={cat.id}
            role="tab"
            className={`font-medium p-2 border-b-2 text-[1.4rem]  cursor-pointer ${
              isActive
                ? "text-[var(--color-primary-600)] border-[var(--color-primary-600)]"
                : "text-gray-500 border-transparent"
            }`}
            onClick={() =>
              router.push({
                pathname: router.pathname,
                query: { ...router.query, tab: cat.tab },
              })
            }
          >
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
