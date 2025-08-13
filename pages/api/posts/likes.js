import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { connectDatabase, getDocumentById } from "../../../helpers/db-util";
import { ObjectId } from "mongodb";

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

    // ✅ 항상 DB 최신 유저로 판별 (세션 스냅샷 X)
    // const user = session.user; ❌❌❌
    const user = await getDocumentById(client, "users", userId);
    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const alreadyLiked = user.likes?.includes(postId);

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

        const updatedUser = await getDocumentById(client, "users", userId);

        return res.status(200).json({
          message: "I cancel like!",
          liked: false,
          likesCount: postResult.likesCount,
          updatedLikes: updatedUser.likes,
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

        const updatedUser = await getDocumentById(client, "users", userId);

        return res.status(200).json({
          message: "I like it :)",
          liked: true,
          likesCount: postResult.likesCount,
          updatedLikes: updatedUser.likes,
        });
      }
    } catch (err) {
      console.error("❌ Error in like handler:", err);
      return res.status(500).json({ message: "Like handling failed!" });
    }
  }

  client.close();
}
