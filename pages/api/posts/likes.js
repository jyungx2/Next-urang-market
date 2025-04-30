import { connectDatabase, getDocumentById } from "../../../helpers/db-util";
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

  // POST HTTP
  if (req.method === "POST") {
    const { userId, postId } = req.body;
    const db = client.db(process.env.MONGODB_NAME); // ✅ DB 인스턴스 생성

    const user = await getDocumentById(client, "users", userId);
    console.log("📦 user found:", user);

    const alreadyLiked = user.likes?.includes(postId);
    console.log("❗️ alreadyLiked:", alreadyLiked);

    console.log("🔍 typeof postId:", typeof postId);
    console.log("🔍 postId raw:", postId);
    console.log("🔍 postId as JSON:", JSON.stringify(postId));

    try {
      if (alreadyLiked) {
        // 좋아요 취소
        await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { likes: postId } }
          );
        const postResult = await db
          .collection("posts")
          .findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $inc: { likesCount: -1 } },
            { returnDocument: "after" }
          );

        console.log("📦 postResult 전체:", postResult);
        console.log("📦 postResult 밸류:", postResult.value);

        res.status(200).json({
          message: "I cancel like!",
          liked: false,
          likesCount: postResult.likesCount,
        });
      } else {
        // 좋아요 추가
        await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { likes: postId } }
          );
        const postResult = await db
          .collection("posts")
          .findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $inc: { likesCount: 1 } },
            { returnDocument: "after" }
          );

        console.log("📦 postResult 전체:", postResult);
        console.log("📦 postResult 밸류:", postResult.value);

        res.status(200).json({
          message: "I like it :)",
          liked: true,
          likesCount: postResult.likesCount,
        });
      }
    } catch (err) {
      console.error("❌ Error in like handler:", err);
      return res.status(500).json({ message: "Like handling failed!" });
    }
  }
}
