// components/common/SearchLocationInput.jsx
import { useState, useRef } from "react";

export default function SearchLocationInput({ onSelect, setIsLoading }) {
  const [searchResults, setSearchResults] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const addressRef = useRef();

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
    <div className="relative flex-grow rounded-2xl bg-[var(--color-grey-200)] p-1">
      <input
        ref={addressRef}
        type="text"
        className="w-full p-3 rounded-xl border text-[1.4rem]"
        placeholder="주소를 입력하세요"
        onKeyDown={(e) => e.key === "Enter" && fetchSearchResults()}
      />

      {searchResults.length > 0 && (
        <ul className="absolute z-10 top-full left-0 w-full mt-2 bg-white border rounded-xl shadow-md max-h-[300px] overflow-y-auto">
          {searchResults.map((item, idx) => (
            <li
              key={idx}
              className="p-4 hover:bg-gray-100 text-[1.5rem] cursor-pointer"
              onClick={() => {
                addressRef.current.value = item.full;
                setSearchResults([]);
                onSelect(item.full); // ✅ 부모에서 전달받은 콜백
              }}
            >
              {item.full}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
