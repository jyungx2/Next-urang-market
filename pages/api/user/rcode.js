// /pages/api/locations/rcode.js
import { connectDatabase } from "@/helpers/db-util";

export default async function handler(req, res) {
  const { sigungu, dong } = req.query;

  if (!sigungu || !dong) {
    return res.status(400).json({ message: "주소 정보 누락" });
  }

  try {
    const client = await connectDatabase();
    const db = client.db(process.env.MONGODB_NAME);

    const result = await db.collection("locations").findOne({
      sigungu,
      eupmyeondong: dong,
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "해당 주소의 rcode를 찾을 수 없습니다" });
    }

    return res.status(200).json({ rcode: result.code });
  } catch (err) {
    return res.status(500).json({ message: "서버 오류" });
  }
}
