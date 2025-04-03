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

  // GET HTTP
  if (req.method === "GET") {
    const { postId } = req.query;

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

  client.close();
}
