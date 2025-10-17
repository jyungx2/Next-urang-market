import Image from "next/image";
import classes from "./searchPage.module.css";
import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useRouter } from "next/router";
import { useSearch } from "@/store/search-context";

export default function SearchPage() {
  // const { toggleSearchPage } = useContext(UIContext);
  const { toggleSearch } = useSearch();

  const searchInputRef = useRef(null);
  const router = useRouter();
  const { rcode } = router.query;
  const { currentUser } = useCurrentUserStore();
  console.log(currentUser);
  const queryClient = useQueryClient();

  //  DOM에 직접 접근해야 하는 상황이기 때문에 useRef가 적절.
  // cf) autoFocus속성은 React가 실제 DOM에 붙이기 전에 놓치는 경우가 있어서 브라우저마다 포커스 안 될 수도 있음 → ❌ 불안정
  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("폼 제출됨");

    const keyword = searchInputRef.current?.value.trim();
    if (!keyword) return;

    // 1. 검색어에 따른 데이터 조회
    // 검색 시 쿼리스트링 업데이트 → useQuery 재실행됨
    router.push({
      pathname: "/market",
      query: { rcode, keyword },
    });
    // 같은 페이지(/market)이기 때문에 단순 라우팅으로는 페이지 이동 X -> Context API로 관리하는 검색페이지를 직접 토글해주자!!
    toggleSearch();

    // 2. 최근 검색어에 PATCH 요청
    try {
      const res = await fetch(`/api/user/search-history`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          keyword, // 디코딩 과정은 쿼리스트링에서만 필요, body에서는 문자열 그대로 보내도 괜찮!
        }),
      });
      const data = await res.json();
      console.log("검색어 추가 요청 성공: ", data);
    } catch (err) {
      console.error(err);
    }
  };

  const { data: searchHistory } = useQuery({
    queryKey: ["search", "history"],
    queryFn: async () => {
      const res = await fetch(
        `/api/user/search-history?userId=${currentUser.id}`
      );
      const data = res.json();
      return data;
    },
    select: (data) => data.searchHistory,
  });

  const deleteSearchMutation = useMutation({
    mutationFn: async ({ userId, keywordIndex }) => {
      const res = await fetch(`/api/user/search-history`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, keywordIndex }),
      });

      const data = await res.json();
      console.log(data.message);
    },
    onSuccess: () => {
      // ⭕️쿼리 키 무효화 -> 리렌더링 유발⭕️
      queryClient.invalidateQueries(["search", "history"]);
      alert("최근 검색어가 삭제되었습니다.");
    },
  });

  const searchHistoryList = searchHistory?.map((item, index) => {
    return (
      <li key={index} className={classes.col}>
        <Image src="/icons/clock.svg" alt="icon" width={20} height={20} />
        <span>{item}</span>
        <button
          className="p-2 mx-2"
          type="button"
          onClick={() =>
            deleteSearchMutation.mutate({
              userId: currentUser.id,
              keywordIndex: index,
            })
          }
        >
          <Image src="/icons/xbtn.svg" alt="icon" width={20} height={20} />
        </button>
      </li>
    );
  });

  return (
    <div className="flex flex-col gap-10 p-6 min-h-screen bg-[var(--color-bg)]">
      <form
        onSubmit={(e) => handleSearch(e)}
        className="flex items-center gap-4"
      >
        <button type="button" className="cursor-pointer" onClick={toggleSearch}>
          <Image
            src="/icons/chevron-left.svg"
            alt="icon"
            width={28}
            height={28}
          />
        </button>

        <div className="border rounded grow">
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            className="inputUnset inputCustom"
            ref={searchInputRef}
          />
        </div>

        <button type="submit" className="cursor-pointer">
          검색
        </button>
      </form>

      <div className="flex flex-col gap-5">
        <span className="font-medium">추천 검색어</span>
        <ul className="flex gap-4 overflow-x-scroll whitespace-nowrap scrollbar-hide flex-wrap">
          <li className={classes.searchWord}>밥솥</li>
          <li className={classes.searchWord}>노트북</li>
          <li className={classes.searchWord}>책상</li>
          <li className={classes.searchWord}>고양이용품</li>
          <li className={classes.searchWord}>고양이 장난감</li>
          <li className={classes.searchWord}>고양이 사료</li>
        </ul>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <span className="font-medium">최근 검색어</span>
          <button
            type="button"
            className="cursor-pointer font-extralight text-[var(--color-grey-600)]"
          >
            <span>모두삭제</span>
          </button>
        </div>

        <ul className="flex flex-col gap-6">{searchHistoryList}</ul>
      </div>
    </div>
  );
}
