// components/common/SearchLocationInput.jsx
import Image from "next/image";

// ⭐️단순히 "입력받고", "검색 결과를 보여주고", "선택 시 부모 콜백 호출"만 하는 구조로 리팩토링 (4/24)⭐️
export default function SearchLocationInput({
  onSelect,
  setIsLoading,
  addressRef,
  searchResults,
  setSearchResults,
}) {
  // ✅ CSV로부터 MongoDB에 저장된 데이터를 기반으로 **검색어(keyword)**를 이용해 주소 리스트를 fetch하는 역할의 함수
  const fetchParsedLocationList = async (keyword) => {
    try {
      const res = await fetch(
        `/api/auth/search-location?keyword=${encodeURIComponent(keyword)}`
      );
      const data = await res.json();
      return data.locations || [];
    } catch (error) {
      console.error("주소 검색 오류:", error);
      return [];
    }
  };

  const fetchSearchResults = async () => {
    const value = addressRef.current.value.trim();
    if (value.length < 2) return;
    setIsLoading(true);
    const results = await fetchParsedLocationList(value);
    setSearchResults(results);
    setIsLoading(false);
  };

  return (
    <>
      <div className="relative flex-grow rounded-2xl bg-[var(--color-grey-200)] p-1">
        <input
          ref={addressRef}
          type="text"
          className="w-full p-3 rounded-xl text-[1.4rem]"
          placeholder="주소를 입력하세요"
          onKeyDown={(e) => e.key === "Enter" && fetchSearchResults()}
        />

        {searchResults.length > 0 && (
          <ul className="absolute z-10 top-full left-0 w-full mt-2 bg-white border rounded-xl shadow-md max-h-[300px] overflow-y-auto">
            {searchResults.map((item, idx) => (
              <li
                key={idx}
                className="p-4 hover:bg-gray-100 text-[1.5rem] cursor-pointer"
                onClick={
                  () => onSelect(item.full, item.code) // ✅ 부모에서 전달받은 콜백 -> 가장 먼저 호출하여 라우팅
                }
              >
                {item.full}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="cursor-pointer" onClick={() => fetchSearchResults()}>
        <Image
          src="/icons/search.svg"
          alt="search-icon"
          width={24}
          height={24}
        />
      </button>
    </>
  );
}
