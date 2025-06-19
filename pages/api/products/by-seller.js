import { connectDatabase } from "@/helpers/db-util";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { sellerId } = req.query;

  if (!sellerId) {
    return res.status(400).json({ message: "sellerId is required" });
  }

  let client;

  try {
    client = await connectDatabase();
  } catch (error) {
    return res.status(500).json({ message: "DB 연결 실패" });
  }

  try {
    const db = client.db();
    const products = await db
      .collection("products")
      .find({
        sellerId: new ObjectId(sellerId),
      })
      .sort({ createdAt: -1 }) // 최신순 정렬
      .toArray();

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "제품 목록 가져오기 실패" });
  } finally {
    client.close();
  }
}
