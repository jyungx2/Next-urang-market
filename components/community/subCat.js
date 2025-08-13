import { useRouter } from "next/router";
import categoryData from "@/data/category";
import { useEffect, useMemo, useState } from "react";

export default function SubCategory() {
  const router = useRouter();
  const { mainCategory, tab } = router.query;

  // 🔧 로컬 상태: 현재 선택된 서브카테고리 탭
  const [activeTab, setActiveTab] = useState(null);

  // 🧠 현재 mainCategory에 해당하는 카테고리 객체 찾기
  const currentMainCat = categoryData.find((cat) => cat.slug === mainCategory);

  // 🧠 useMemo로 서브카테고리 참조값을 안정적으로 유지 (불필요한 렌더링 방지)
  // 💥 문제: subCategories = []가 렌더링마다 새 배열을 만들어 useEffect가 계속 실행될 수 있음...
  // **현재는 !category 조건이 있어서 괜찮지만(어느 서브카테고리를 누르든, useRouter().push()로 query string을 지정해줬으므로..), if (subCategories.length > 0)만 쓰면 다른 서브카테고리 눌러도 다시 첫번째 서브카테고리로 리셋될 수 있음 (실제로 클릭한 서브카테고리가 active 됐다가 다시 결국엔 첫번째 서브카테고리가 active되는 걸 볼 수 있음.)** ➡️ 현재는 괜찮지만 미래에 위험해질 수도 있으니 미리 방어하자는 의미로 useMemo()를 통해 특정 밸류를 기억하여 참조값이 변경되는 것을 방지하자!
  // ✅ 해결: useMemo로 ✨배열을 메모이제이션✨해서 참조값 유지 => useEffect의 의존성 경고를 없애고 예측 가능한 동작을 보장.
  // 🖍️ 결과: useEffect 의존성 배열ㄴ이 안정적(새로운 참조값 생성하지 않아 불필요한 렌더링 방지, 의도하지 않은 결과 방지 가능)이 되고, 불필요한 실행 방지
  const subCategories = useMemo(() => {
    return currentMainCat?.subCategories || [];
  }, [currentMainCat]);

  // 1️⃣ ① 메인 카테고리 변경으로 최초 접근 시: tab 쿼리가 없으면 첫 번째 서브카테고리 자동 선택 + URL에도 반영
  useEffect(() => {
    if (!tab && subCategories.length > 0) {
      const firstTab = subCategories[0].tab;
      setActiveTab(firstTab); // UI 즉시 반영
      // tab 쿼리가 없을 때 첫 번째 서브카테고리로 설정
      // replace(): 현재 URL만 교체 → 깔끔함 & push로 하면 "브라우저 히스토리에 추가됨 → 뒤로가기 불편해지는 현상" 방지.
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: firstTab },
        },
        undefined,
        { shallow: false } // 쿼리만 변경하고 전체 페이지 리로드는 하지 않음
        // true로 하면... 서버에서 새 HTML/데이터를 가져오지 않고, 클라이언트에서만 리렌더링 발생
        // 즉, 라우팅 경로(pathname)는 동일하게 유지하면서, query string만 변경할 때, getServerSideProps, getStaticProps, getInitialProps 등을 다시 실행하지 않게 함..
        // 💥단! useSWR(), useEffect()처럼 클라이언트에서 "query를 기반으로 fetch"하는 로직은 정상 작동함)
      );
    }
  }, [tab, subCategories, router]);

  // 3️⃣ 어떤 방식으로든(tab 쿼리가 직접 바뀌든, 뒤로가기를 누르든, 외부 링크에서 들어오든)
  //    tab 쿼리값이 바뀔 때마다 activeTab 상태를 동기화함.
  //    🌟 이유: router.query는 URL에 있는 값이고, 이 값은 React state와 다르게 관리되므로,
  //    UI에서 사용하는 상태(activeTab)를 항상 맞춰주는 useEffect가 필요함.
  //    💥이걸 안 하면 URL은 바뀌었는데 버튼 active 스타일은 바뀌지 않는 문제가 생길 수 있음💥
  // -> 라우터 query 값은 상태랑 분리되어 있기 때문에", 항상 useEffect로 동기화 로직을 넣어주는 게 안전하고 확실!!
  useEffect(() => {
    if (tab) {
      setActiveTab(tab); // URL이 바뀌면 UI도 맞춰서 업데이트
    }
  }, [tab]);

  return (
    <div id="category-2" className="flex gap-6 mb-4 px-4">
      {/* 상단 버튼에 의해 필터링되는 2차 카테고리
          워홀: 필독공지/비자승인/경험공유
          해외취업: 성공후기/조언구해요 */}

      {subCategories.map((cat) => {
        const isActive = activeTab === cat.tab;
        return (
          <button
            key={cat.id}
            role="tab"
            className={`font-medium p-2 border-b-2 text-[1.4rem]  cursor-pointer ${
              isActive
                ? "text-[var(--color-primary-600)] border-[var(--color-primary-600)]"
                : "text-gray-500 border-transparent"
            }`}
            onClick={() => {
              // 2️⃣ 아래 active 스타일링 반영코드는 유저가 버튼을 ✨직접✨ 클릭할 때만 실행
              // 다른 경로로 tab 값이 바뀌는 경우에는 작동 안함..
              // 1. 뒤로가기/앞으로가기
              // 2. 미래에 tab쿼리를 직접 붙여서 특정 카테고리로 이동하는 링크가 필요할 경우, tab이 이미 존재함 -> if(!tab) 조건 실행x, 사실 실행되면 안됨. (이건 메인카테고리를 직접 바꿨을 때만 기본으로 첫번째 서브카테고리를 active하게 하는거니까.) => 대신, 해당 tab을 active시켜야함 => if(tab) 조건에서 setActive() 해줄 필요 있음!

              setActiveTab(cat.tab); // 즉시 activeTab 상태 업데이트 → UI 바로 반영
              router.push({
                pathname: router.pathname,
                query: { ...router.query, tab: cat.tab },
              }); // 쿼리 string에 tab 값 추가 → URL 상태 변경
            }}
          >
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
