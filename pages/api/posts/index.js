import {
  connectDatabase,
  insertDocument,
  getAllDocuments,
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

  // POST HTTP
  if (req.method === "POST") {
    const {
      writer,
      profileImage,
      title,
      content,
      mainCategory,
      subCategory,
      dong,
      rcode,
    } = req.body;
    console.log(req.query);

    // Validation for server-side
    if (
      !writer ||
      !profileImage ||
      !content ||
      !mainCategory ||
      !subCategory ||
      !dong ||
      !rcode
    ) {
      res.status(422).json({ message: "Invalid input - post" });
      client.close();
      return;
    }

    const newPost = {
      writer,
      profileImage,
      title,
      content,
      mainCategory,
      subCategory,
      createdAt: new Date(),
      dong,
      rcode,
    };

    let result;
    try {
      result = await insertDocument(client, "posts", newPost);
      newPost._id = result.insertedId;
      res
        .status(201)
        .json({ message: "Added post in community page", post: newPost });
    } catch (err) {
      res.status(500).json({ message: "Inserting post failed!" });
    }
  }

  // GET HTTP
  if (req.method === "GET") {
    const { mainCategory, subCategory, rcode } = req.query;

    const filter = { mainCategory, subCategory, rcode };

    try {
      const documents = await getAllDocuments(
        client,
        "posts",
        { _id: -1 },
        filter
      );
      res.status(200).json({ posts: documents });
    } catch (err) {
      res.status(500).json({ message: "Getting posts failed!" });
    }
  }

  client.close();
}
