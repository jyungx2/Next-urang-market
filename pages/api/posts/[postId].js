import { connectDatabase, getDocumentById } from "../../../helpers/db-util";

export default async function handler(req, res) {
  const postId = req.query.postId;
  let client;

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  // POST HTTP
  if (req.method === "GET") {
    try {
      const document = await getDocumentById(client, "posts", postId);
      res.status(200).json({ post: document });
    } catch (err) {
      res.status(500).json({ message: "Getting specific post failed!" });
    }
  }

  client.close();
}
