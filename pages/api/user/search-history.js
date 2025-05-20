import { ObjectId } from "mongodb";
import { connectDatabase } from "../../../helpers/db-util";

export default async function handler(req, res) {
  let client;

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  const db = client.db(process.env.MONGODB_NAME);

  // GET HTTP
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId는 필수입니다." });
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    return res.status(200).json({
      searchHistory: user.searchHistory ?? [],
    });
  }

  // ✅ POST: 최근 검색어 추가 (중복 제거 후 삽입)
  if (req.method === "PATCH") {
    const { userId, keyword } = req.body;

    if (!userId || !keyword || keyword.trim() === "") {
      client.close();
      return res
        .status(422)
        .json({ message: "userId와 유효한 keyword는 필수입니다." });
    }

    const trimmedKeyword = keyword.trim();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: {
          searchHistory: {
            $each: [trimmedKeyword],
            $slice: -10, // 최신 10개만 유지
          },
        },
      }
    );

    return res.status(200).json({
      searchHistory: user.searchHistory,
      message: "최근 검색어 추가 완료",
    });
  }

  client.close();
  return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
}
