import { ObjectId } from "mongodb";
import { connectDatabase, getDocumentById } from "../../../helpers/db-util";

export default async function handler(req, res) {
  let client;

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  // DELETE HTTP
  if (req.method === "DELETE") {
    const { postId, commentId } = req.body;

    if (!postId || !commentId) {
      return res
        .status(400)
        .json({ message: "postId, commentId가 필요합니다." });
    }

    try {
      const db = client.db(process.env.MONGODB_NAME); // ✅ 추가 필요

      await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: {
            comments: { _id: new ObjectId(commentId) },
          },
        }
      );
      return res.status(200).json({ message: "댓글이 삭제되었습니다." });
    } catch (err) {
      return res.status(500).json({ message: "댓글 삭제 실패" });
    }
  }

  if (req.method === "POST") {
    // POST HTTP
    const { postId } = req.query;
    const { writer, profileImage, content } = req.body;

    const newComment = {
      _id: new ObjectId(), // ✅ 직접 생성
      writer,
      profileImage,
      content,
      createdAt: new Date(),
    };

    try {
      const db = client.db(process.env.MONGODB_NAME); // ✅ 추가 필요

      await db
        .collection("posts")
        .updateOne(
          { _id: new ObjectId(postId) },
          { $push: { comments: newComment } }
        );

      res.status(201).json({ message: "😙 Comment is added!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Posting your post failed!" });
    }
  }

  // GET HTTP
  if (req.method === "GET") {
    const { postId } = req.query;

    try {
      const document = await getDocumentById(client, "posts", postId);

      if (!document) {
        res.status(404).json({ message: "Comments not found." });
        return;
      }

      res.status(200).json({ comments: document.comments });
    } catch (err) {
      res.status(500).json({ message: "Getting specific post failed!" });
    }
  }

  client.close();
}
