// components/LocationModal.jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LocationModal({ onClose, onSave }) {
  const [location, setLocation] = useState("");
  const router = useRouter();
  const rcode = router.query.rcode;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    onSave(location.trim());
    onClose();

    router.push({
      pathname: "/market/product/new",
      query: { rcode, placeName: location.trim() },
    });
  };

  // ✅ ESC 키 이벤트 등록
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey); // ✅ 정리
    };
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={() => onClose()}
    >
      <div
        className="w-full max-w-[640px] bg-[#1c1c1e] text-white rounded-t-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[2rem] font-semibold mb-2">
          Enter a name for this location
        </h2>
        <p className="text-[1.4rem] text-gray-400 mb-4">
          e.g. 강남역 1번 출구, 교보타워 앞
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. 강남역 1번 출구, 교보타워 앞"
            className="w-full p-3 rounded-lg bg-[#2c2c2e] text-white placeholder-gray-500 outline-none mb-4"
          />
          <button
            type="submit"
            className="w-full bg-[var(--color-primary-500)] text-white font-semibold py-3 rounded-lg disabled:opacity-60"
            disabled={!location.trim()}
          >
            Save place
          </button>
        </form>
      </div>
    </div>
  );
}
