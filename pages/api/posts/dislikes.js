import { getServerSession } from "next-auth";
import { connectDatabase, getDocumentById } from "../../../helpers/db-util";
import { ObjectId } from "mongodb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  let client;

  // ✅ req.body가 아니라, 세션에서 "userId" 획득
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const userId = session.user.id; // ✅ 세션에서만 가져오기

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  // POST HTTP
  if (req.method === "POST") {
    const { postId } = req.body; // 더 이상 userId를 받지 않음
    const db = client.db(process.env.MONGODB_NAME); // DB 인스턴스 생성

    const user = await getDocumentById(client, "users", userId); // 세션에서 받아온 userId로 DB에서 유저 정보 획득
    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

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

        const updatedUser = await getDocumentById(client, "users", userId);

        return res.status(200).json({
          message: "I cancel dislike!",
          disliked: false,
          dislikesCount: postResult.dislikesCount,
          updatedDislikes: updatedUser.dislikes,
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

        const updatedUser = await getDocumentById(client, "users", userId);

        return res.status(200).json({
          message: "I dislike it :(",
          disliked: true,
          dislikesCount: postResult.dislikesCount,
          updatedDislikes: updatedUser.dislikes,
        });
      }
    } catch (err) {
      console.error("❌ Error in dislike handler:", err);
      return res.status(500).json({ message: "Dislike handling failed!" });
    }
  }

  client.close();
}
