// ✅ /pages/api/user/location.js
import { connectDatabase } from "@/helpers/db-util";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await connectDatabase();
  const db = client.db(process.env.MONGODB_NAME); // 💢💢꼭 매개변수로 데이터베이스 이름(urang-market) 넣어주자! connectDatabase()은 DB 이름 포함 안 시켰다!!!💢💢

  if (req.method === "PATCH") {
    const {
      // userId,
      // location,
      // recentLocation,
      // selectedLocation,
      // locationIdToRemove,
    } = req.body;

    // if (
    //   (!userId && !location) ||
    //   (!userId && !recentLocation) ||
    //   (!userId && !selectedLocation) ||
    //   (!userId && !locationIdToRemove)
    // ) {
    //   return res.status(400).json({ message: "잘못된 요청입니다." });
    // }

    // if (locationIdToRemove) {
    //   await db.collection("users").updateOne(
    //     { _id: new ObjectId(userId) },
    //     {
    //       $pull: { recentLocations: { id: locationIdToRemove } },
    //     }
    //   );
    //   return res.status(200).json({ message: "최근 위치 삭제 완료" });
    // }

    // if (selectedLocation) {
    //   await db.collection("users").updateOne(
    //     { _id: new ObjectId(userId) },
    //     { $set: { selectedLocation } } // selectedLocation: 객체 형태의 데이터 (keyword, isVerified 속성 담고 있는)
    //   );
    //   return res.status(200).json({ message: "현재 선택한 위치 변경 완료" });
    // }

    // if (location) {
    //   await db
    //     .collection("users")
    //     .updateOne({ _id: new ObjectId(userId) }, { $set: { location } });

    //   return res.status(200).json({ message: "현재 위치 수정 완료" });
    // }

    // if (recentLocation) {
    //   await db.collection("users").updateOne(
    //     { _id: new ObjectId(userId) },
    //     {
    //       $push: {
    //         recentLocations: {
    //           $each: [recentLocation],
    //           $slice: -3, // 최신 3개만 유지
    //         },
    //       },
    //     }
    //   );

    //   return res.status(200).json({ message: "최근 지역 추가 완료" });
    // }
  }

  // if (req.method === "GET") {
  //   const { userId } = req.query;
  //   console.log("서버가 받은 userId: ", userId);

  //   if (!userId) {
  //     return res.status(400).json({ message: "userId는 필수입니다." });
  //   }

  //   const user = await db
  //     .collection("users")
  //     .findOne({ _id: new ObjectId(userId) });

  //   if (!user) {
  //     return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  //   }

  //   return res.status(200).json({
  //     location: user.location,
  //     recentLocations: user.recentLocations ?? [],
  //   });
  // }

  return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
}
