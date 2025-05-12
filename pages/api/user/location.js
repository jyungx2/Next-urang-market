// ✅ /pages/api/user/location.js
import { connectDatabase } from "@/helpers/db-util";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await connectDatabase();
  const db = client.db(process.env.MONGODB_NAME); // 💢💢꼭 매개변수로 데이터베이스 이름(urang-market) 넣어주자! connectDatabase()은 DB 이름 포함 안 시켰다!!!💢💢

  if (req.method === "PATCH") {
    const { userId, location } = req.body;

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { location } });

    return res.status(200).json({ message: "현재 나의 위치 수정 완료" });
  }
}
