// ✅ /pages/api/user/location.js
import { connectDatabase } from "@/helpers/db-util";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await connectDatabase();
  const db = client.db(process.env.MONGODB_NAME); // 💢💢꼭 매개변수로 데이터베이스 이름(urang-market) 넣어주자! connectDatabase()은 DB 이름 포함 안 시켰다!!!💢💢

  if (req.method === "PATCH") {
    const { userId, selectedLocation } = req.body;

    await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { selectedLocation } }, // selectedLocation: 객체 형태의 데이터 (keyword, isVerified 속성 담고 있는)
      {
        returnDocument: "after",
        projection: { selectedLocation: 1 },
      }
    );
    return res
      .status(200)
      .json({
        selectedLocation: selectedLocation ?? {},
        message: "현재 선택한 위치 변경 완료",
      });
  }
}
