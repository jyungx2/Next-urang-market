// pages/api/orders.js
import { connectDatabase, getDocumentById } from "@/helpers/db-util";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { productId, buyerId } = req.body;

  if (!productId || !buyerId) {
    return res.status(400).json({ message: "Missing productId or buyerId" });
  }

  let client;
  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  try {
    // 1. 상품 조회
    const product = await getDocumentById(client, "products", productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const db = client.db(process.env.MONGODB_NAME);

    // 2. 주문 정보 생성
    const newOrder = {
      productId: new ObjectId(productId),
      buyerId: new ObjectId(buyerId),
      sellerId: new ObjectId(product.sellerId),
      price: product.price,
      status: "paid", // 기본 상태
      createdAt: new Date(),
    };

    // 3. 저장
    const result = await db.collection("orders").insertOne(newOrder);

    res
      .status(201)
      .json({ message: "Order created", orderId: result.insertedId });
  } catch (error) {
    console.error("❌ 주문 저장 실패:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    client.close();
  }
}
