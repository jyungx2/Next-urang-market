import { connectDatabase, getAllDocuments } from "@/helpers/db-util";

export default async function handler(req, res) {
  // ❌ 캐시를 아예 쓰지 말라고 명령
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") return res.status(405).end();

  const { roomId } = req.query;
  if (!roomId) return res.status(400).json({ message: "roomId is required" });

  // CONNECT TO DB
  let client;

  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  try {
    // const db = client.db(process.env.MONGODB_NAME);
    // const messages = await db
    //   .collection("messages")
    //   .find({ roomId })
    //   .sort({ createdAt: -1 }) // 최신 순 (최근 메시지부터)
    //   .toArray();
    const filter = { roomId };

    // 비동기 함수인데 await을 안붙이면, 실제 데이터가 아닌 Promise 객체가 들어가 이걸 그대로 JSON 형태로 클라이언트 코드로 넘기므로 messages 배열(useQuery로 페치)상에서 mapping function 사용 불가능.
    const documents = await getAllDocuments(
      client,
      "messages",
      { createdAt: 1 },
      filter
    );

    res.status(200).json({ messages: documents });
    client.close();
  } catch (err) {
    res.status(500).json({ message: "DB 연결 실패", error: err.message });
  }
}
