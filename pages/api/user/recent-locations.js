// ✅ /pages/api/user/location.js
import { connectDatabase } from "@/helpers/db-util";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  let client;

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  const db = client.db(process.env.MONGODB_NAME); // 💢💢꼭 매개변수로 데이터베이스 이름(urang-market) 넣어주자! connectDatabase()은 DB 이름 포함 안 시켰다!!!💢💢

  if (req.method === "GET") {
    const { userId } = req.query;
    console.log("서버가 받은 userId: ", userId);

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
      location: user.location, // ⭐️ location(내동네 위치) 값도 같이 보내주자.
      recentLocations: user.recentLocations ?? [],
    });
  }

  if (req.method === "PATCH") {
    const { userId, recentLocation } = req.body;
    if (!userId || !recentLocation) {
      return res.status(400).json({
        message: "요청 바디에는 userId와 추가할 recentLocation이 필요합니다.",
      });
    }

    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $push: {
          recentLocations: {
            $each: [recentLocation],
            $slice: -10, // 최신 10개만 유지
          },
        },
      },
      {
        returnDocument: "after", // ✅ 업데이트 후 문서 반환
        projection: { recentLocations: 1 }, // recentLocations만 받고 _id는 제외
        // * 프로젝션(Projection)은 “조회한 문서에서 어떤 필드만(혹은 어떤 필드를 빼고) 돌려줄지”를 지정하는 옵션
      }
    );

    if (!result.recentLocations) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    return res.status(200).json({
      recentLocations: result?.recentLocations ?? [],
      message: "최근 지역 추가 완료",
    });
  }

  if (req.method === "DELETE") {
    const { userId, locationId } = req.query;
    if (!userId || !locationId) {
      return res
        .status(400)
        .json({ message: "userId와 locationId가 필요합니다." });
    }

    const idToDelete = Number(locationId);
    if (Number.isNaN(idToDelete)) {
      return res.status(400).json({ message: "locationId는 숫자여야 합니다." });
    }

    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $pull: { recentLocations: { id: idToDelete } },
      },
      {
        returnDocument: "after", // ✅ 업데이트 후 문서 반환
        projection: { recentLocations: 1 }, // recentLocations만 받고 _id는 제외
        // * 프로젝션(Projection)은 “조회한 문서에서 어떤 필드만(혹은 어떤 필드를 빼고) 돌려줄지”를 지정하는 옵션
      }
    );
    console.log("📝 result.value: ", result, result.value);
    if (!result.recentLocations) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    return res.status(200).json({
      recentLocations: result?.recentLocations ?? [],
      message: "최근 위치 삭제 완료",
    });
  }

  client.close();
  return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
}
