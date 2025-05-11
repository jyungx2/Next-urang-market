import {
  connectDatabase,
  deleteDocumentById,
  getDocumentById,
} from "../../../helpers/db-util";

export default async function handler(req, res) {
  let client;

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  // GET HTTP
  if (req.method === "GET") {
    const { postId } = req.query; // client에서 요청 시, 파라미터가 query든, path든 Next.js에서는 무조건 req.query로 받는다!

    try {
      const document = await getDocumentById(client, "posts", postId);

      // if (!document) {
      //   res.status(404).json({ message: "Post not found." });
      //   return;
      // }

      res.status(200).json({ post: document });
    } catch (err) {
      res.status(500).json({ message: "Getting specific post failed!" });
    }
  }

  if (req.method === "DELETE") {
    const { postId } = req.query;

    try {
      const result = await deleteDocumentById(client, "posts", postId);

      if (result.deletedCount === 0) {
        res.status(404).json({ message: "삭제할 게시물을 찾지 못했습니다." });
        return;
      }
      res.status(200).json({ message: "Post deleted successfully." });
    } catch (err) {
      res.status(500).json({ message: "Deleting specific post failed!" });
    }
  }

  client.close();
}
