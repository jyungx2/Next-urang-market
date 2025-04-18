// ✅ /pages/api/user/location.js
import { connectDatabase } from "@/helpers/db-util";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await connectDatabase();
  const db = client.db(process.env.MONGODB_NAME); // 💢💢꼭 매개변수로 데이터베이스 이름(urang-market) 넣어주자! connectDatabase()은 DB 이름 포함 안 시켰다!!!💢💢

  if (req.method === "POST") {
    const { userId, recentLocations } = req.body;

    if (!userId || !Array.isArray(recentLocations)) {
      return res.status(400).json({ message: "잘못된 요청입니다." });
    }

    await db.collection("users").updateOne(
      { userId },
      {
        $set: {
          recentLocations, // 예: 배열 [{ id, keyword: [...], isVerified }]
        },
      },
      { upsert: true }
    );

    return res.status(200).json({ message: "최근 위치 정보 저장 완료" });
  }

  if (req.method === "PUT") {
    const { userId, location } = req.body;

    if (!userId || !location) {
      return res.status(400).json({ message: "잘못된 요청입니다." });
    }

    let formattedLocation = location;

    // 문자열일 경우 객체로 변환
    if (typeof location === "string") {
      formattedLocation = {
        keyword: location.split(" ").slice(-2), // 예: ["계양구", "행복동"]
        isVerified: false,
      };
    }

    await db.collection("users").updateOne(
      { userId },
      {
        $set: {
          location: formattedLocation, // 항상 객체 형태로 저장
        },
      }
    );

    return res.status(200).json({ message: "현재 위치 정보 수정 완료" });
  }

  if (req.method === "GET") {
    const { userId } = req.query;
    console.log("서버가 받은 userId: ", userId);

    if (!userId) {
      return res.status(400).json({ message: "userId는 필수입니다." });
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId.trim()) });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    let location = user.location || null;

    // 문자열로 저장된 경우 객체로 변환
    if (typeof location === "string") {
      location = {
        keyword: location.split(" ").slice(-2),
        isVerified: false,
      };
    }

    return res.status(200).json({
      location,
      recentLocations: user.recentLocations || [],
    });
  }

  return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
}
