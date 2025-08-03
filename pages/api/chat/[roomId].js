import { connectDatabase, getDocumentById } from "../../../helpers/db-util";

export default async function handler(req, res) {
  let client;

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  // GET HTTP
  if (req.method === "GET") {
    const { roomId } = req.query; // client에서 요청 시, 파라미터가 query든, path든 Next.js에서는 무조건 req.query로 받는다!
    // ** POST, PATCH, PUT 요청 시에 필요한 데이터는 req.body로 받는다.**

    try {
      const db = client.db(process.env.MONGODB_NAME);
      const document = await db.collection("chatRooms").findOne({ roomId }); // 문자열 그대로 사용
      console.log(`채팅방 상세 정보: `, document);

      if (!document) {
        res.status(404).json({ message: "chatRoom not found." });
        return;
      }

      res.status(200).json({ chatDetail: document });
    } catch (err) {
      res.status(500).json({ message: "Getting specific post failed!" });
    }
  }

  client.close();
}
