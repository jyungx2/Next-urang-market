import {
  connectDatabase,
  getDocumentsByKeyword,
  insertDocument,
} from "@/helpers/db-util";

// ✅ let cachedClient = null을 함수 바깥에 두는 이유는, Next.js API Routes가 모듈을 “메모리에 유지”시키기 때문에, 커넥션을 효율적으로 재사용할 수 있기 때문
let cachedClient = null; // 모듈 스코프 (한 번만 실행됨, 서버가 꺼질 때까지 유지됨) =>  최초 1번 연결 후 재사용 가능 (성능 👍)
// 만약, handler 내부에 쓴다면, 요청 들어올 때마다 cachedClient = null이 되기 때문에 connectDatabase()가 매번 실행됨 (== 새로운 DB 커넥션 생성됨) => 비효율, 위험❌

// 요청마다 실행됨 (클라이언트에서 요청할 때마다 새로 실행됨)
export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword || keyword.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "검색어는 최소 2글자 이상이어야 합니다." });
  }

  try {
    // 캐싱된 클라이언트가 없으면 헬퍼함수로 DB 연결(최초 db 삽입 시)
    if (!cachedClient) {
      const client = await connectDatabase();
      cachedClient = client;
    }

    const results = await getDocumentsByKeyword(
      cachedClient,
      "locations",
      keyword
    );

    res.status(200).json({ locations: results });
  } catch (error) {
    console.error("API 검색 오류:", error);
    res.status(500).json({ message: "검색 중 오류가 발생했습니다." });
  }
}
