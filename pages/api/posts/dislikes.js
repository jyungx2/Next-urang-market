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

    const alreadyDisliked = user.dislikes?.includes(postId);

    try {
      if (alreadyDisliked) {
        // 싫어요 취소
        await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { dislikes: postId } }
          );

        const postResult = await db
          .collection("posts")
          .findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $inc: { dislikesCount: -1 } },
            { returnDocument: "after" }
          );

        res.status(200).json({
          message: "I cancel dislike!",
          disliked: false,
          dislikesCount: postResult.dislikesCount,
        });
      } else {
        // 싫어요 추가
        await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { dislikes: postId } }
          );

        const postResult = await db
          .collection("posts")
          .findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $inc: { dislikesCount: 1 } },
            { returnDocument: "after" }
          );

        res.status(200).json({
          message: "I dislike it :(",
          disliked: true,
          dislikesCount: postResult.dislikesCount,
        });
      }
    } catch (err) {
      console.error("❌ Error in dislike handler:", err);
      return res.status(500).json({ message: "Dislike handling failed!" });
    }
  }
}
