// pages/api/chat-rooms.js
import { connectDatabase } from "@/helpers/db-util";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") return res.status(405).end();

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  let client;
  try {
    client = await connectDatabase();
    const db = client.db(process.env.MONGODB_NAME);

    // userId가 buyerId 또는 sellerId로 포함된 채팅방 찾기
    const chatRooms = await db
      .collection("chatRooms")
      .find({
        $or: [{ buyerId: userId }, { sellerId: userId }],
      })
      .sort({ lastMessageAt: -1 }) // 최근 메시지 순 정렬
      .toArray();

    res.status(200).json({ chatRooms });
  } catch (err) {
    res.status(500).json({ message: "DB 연결 실패", error: err.message });
  } finally {
    client?.close();
  }
}
